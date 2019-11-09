const express = require("express");
const router = express.Router();
const models = require("../../models/");
const {
	Item,
} = models

const pool = require("../../config/database");
const utils = require("../../utils/");
const { check, validationResult } = require("express-validator/check");

const checkSerial = [
	check("serial_no")
		.isArray()
		.not()
		.isEmpty()
		.withMessage("Invalid or Empty Serial No.")
];

// Install (pending)
// IN_STOCK/RESERVED -> PENDING
// Removes the reserved_branch_code of the items
// Check if the item is reserved by the provided branch
installItems = async (serial_no, branch_code) => {
	let errors = [];
	let updatedSerials = [];

	const validateSerial = await Item.checkStatus(serial_no, ["IN_STOCK","RESERVED"]);
	errors = [...validateSerial.errors];
	await Promise.all(
		validateSerial.validData.map(async d => {
			if (d.reserved_branch_code && d.reserved_branch_code != branch_code) {
				errors.push({ msg: `The item ${d.serial_no} is reserved by another branch.` });
			} else {
				const r = await utils.update({
					table: "item",
					info: {
						status: "PENDING",
					},
					where: `"serial_no" = :serial_no`,
					replacements: {
						serial_no: d.serial_no
					}
				});
				if (r.errors) {
					errors = [...validateSerial.errors, ...r.errors]
				} else {
					updatedSerials.push(d.serial_no)
				}
			}
		})
	)
	return {
		updatedSerials,
		errors
	};
};
// Confirm Install
// PENDING -> INSTALLED/LENT/TRANSFERRED
confirmItems = async (id, type ) => {
	let status = ""
	switch(type) {
		case "INSTALLATION":
			status = "INSTALLED";
			break;
		case "LENDING":
			status = "LENT"
			break;
		case "TRANSFER":
			status = "TRANSFERRED"
			break;
		default: status = "INSTALLED"
	}
	return pool.query(`
		BEGIN;
			UPDATE "item"
			SET "status" = '${status}'
			FROM "withdrawal_has_item"
			WHERE "item"."serial_no" = "withdrawal_has_item"."serial_no"
			AND "withdrawal_has_item"."withdrawal_id" = ${id};
		
			UPDATE "withdrawal"
			SET "status" = 'CONFIRMED'
			WHERE "withdrawal"."id" = ${id};
		COMMIT;
	`).then(r => ({
			errors: []
		}))
		.catch(err => {
			return { errors: [{msg: "This withdrawal cannot be confirmed."}]}
		})
};

// Reserve
// IN_STOCK -> RESERVED
router.put(
	"/reserve",
	checkSerial,
	async (req, res) => {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			return res.status(422).json({ errors: validationErrors.array() });
		}

		const { reserved_branch_code, serial_no } = req.body;

		const r = await Item.changeStatus({
			serial_no,
			validStatus: "IN_STOCK",
			toStatus: "RESERVED",
			otherInfo: {
				reserved_branch_code,
			}
		});
		const { errors } = r;
		if (errors.length > 0) res.status(400).json({ errors });
		else res.sendStatus(200);
	}
);

// Return without History 
// (In case of editing/canceling withdrawal and reservation cancellation)
// ANY -> IN_STOCK
returnItems = async serial_no => {
	const res = await Item.changeStatus({
		serial_no,
		toStatus: "IN_STOCK",
		otherInfo: {
			reserved_branch_code: null,
		}
	});
	const { updatedSerials, errors } = res;
	return {
		updatedSerials,
		errors
	};
};
router.put("/return-wo-history", checkSerial, async (req,res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	// serial_no is an array
	const { serial_no } = req.body;

	const r = await returnItems(serial_no);
	if (r.errors.length > 0) res.status(400).json({ errors: r.errors });
	else res.sendStatus(200);
})

// Return with History 
router.put("/return", checkSerial, async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	// serial_no is an array
	const { serial_no } = req.body;
	let trans_string_a = [];
	replacements = {}
	let n = 1
	serial_no.forEach(no => {
		const s = `
		UPDATE "item" 
		SET "status" = 'IN_STOCK' 
		WHERE "item"."serial_no" = '${no}';
		
		INSERT INTO "return_history" ("return_datetime", "serial_no")
		VALUES (current_timestamp, '${no}');`;
		trans_string_a.push(s)
		replacements[`serial_no_${n}`] = no;
		n++
	})
	const serial_string = Item.buildWhere(serial_no);
	const trans_string = trans_string_a.join("; ");

	// Get status of the items, make sure they are either INSTALLED, TRANSFERRED, or LENT.
	const r = await utils.raw({
		string: `
			SELECT "item"."status", "item"."serial_no"
			FROM "item"
			WHERE ${serial_string}
		`,
		replacements
	})
	let errors = [];
	r.rows.forEach(re => {
		if (re.status !== "INSTALLED" && re.status !== "TRANSFERRED" && re.status !== "LENT") {
			errors.push({ msg: `Item serial no. ${re.serial_no} is either reserved or already returned.`});
		}
	})
	if (errors.length > 0) {
		res.status(400).json(errors);
		return;
	}
	await pool.query(`
		BEGIN;
			${trans_string}
		COMMIT;
	`).then(r => res.sendStatus(200))
		.catch(err => 
			res.status(500).json({ errors: [{msg: "Items cannot be returned."}]})
		);
});

// Mark Broken/Not Broken
router.put(
	"/broken",
	[
		...checkSerial,
		check("is_broken")
			.isBoolean()
			.withMessage("Invalid Broken value. Must be either true or false.")
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const { serial_no, is_broken } = req.body;
		await Promise.all(
			serial_no.map(async no => {
				const q = await utils.update({
					table: "item",
					info: {
						is_broken,
					},
					where: `"serial_no" = :no`,
					replacements: {
						no
					}
				});
				if (q.errors) {
					errors.push({ msg: `Item serial no. ${no} was not updated.`});
				}
			})
		);
		if (errors.length > 0) res.status(400).json({ errors });
		else res.sendStatus(200);
	}
);

module.exports = {
	router,
	installItems,
	confirmItems,
	returnItems
};
