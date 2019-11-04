const express = require("express");
const router = express.Router();
const models = require("../../models/");
const {
	Item,
} = models

const pool = require("../../config/database");
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

	await Promise.all(
		serial_no.map(async no => {
			const valid = await Item.checkStatus(no, ["IN_STOCK", "RESERVED"]);
			if (!valid) {
				errors.push({ msg: `The item ${no} is not IN_STOCK` });
			} else {

				const q = await findOne({
					cols: Item.getColumns,
					tables: "item",
					where: `"serial_no" = '${no}'`,
				});
				if (q.data.reserved_branch_code && q.data.reserved_branch_code != branch_code) {
					errors.push({ msg: `The item ${no} is reserved by another branch.` });
				} else {
					const r = await update({
						table: "item",
						info: {
							status: "PENDING",
						},
						where: `"serial_no" = '${no}'`
					});
					if (r.errors) {
						errors = r.errors
					} else {
						updatedSerials.push(no)
					}
				}
			}
		})
	);
	return {
		updatedSerials,
		errors
	};
};
// Confirm Install
// PENDING -> INSTALLED
confirmItems = async id => {
	return pool.query(`
		BEGIN TRANSACTION [Trans2]
		BEGIN TRY
			UPDATE "item"
			SET "status" = 'INSTALLED'
			FROM "withdrawal_has_item"
			WHERE "item"."serial_no" = "withdrawal_has_item"."serial_no"
			AND "withdrawal_has_item"."withdrawal_id" = ${id}
		
			UPDATE "withdrawal"
			SET "status" = 'CONFIRMED'
			WHERE "withdrawal"."id" = ${id}

			COMMIT TRANSACTION [Trans2]
		END TRY

		BEGIN CATCH
      		ROLLBACK TRANSACTION [Trans2]
  		END CATCH  
	`).then(r => ({
			errors: []
		}))
		.catch(err => ({ errors: [{msg: "This withdrawal cannot be confirmed."}]}));
};

// Transfer
// IN_STOCK -> TRANSFERRED
transferItems = async serial_no => {
	const res = await Item.changeStatus({
		serial_no,
		validStatus: "IN_STOCK",
		toStatus: "TRANSFERRED"
	});
	const { updatedSerials, errors } = res;
	return {
		updatedSerials,
		errors
	};
};

// Lend
// IN_STOCK -> LENT
lendItems = async serial_no => {
	const res = await Item.changeStatus({
		serial_no,
		validStatus: "IN_STOCK",
		toStatus: "LENT"
	});
	const { updatedSerials, errors } = res;
	return {
		updatedSerials,
		errors
	};
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
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	// serial_no is an array
	const { serial_no } = req.body;

	/* TODO: Transaction
	1. Change status of all items in array to IN_STOCK (see returnItems function)
	2. Add all items to return_history table (return_datetime, serial_no)
	*/
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
				const q = await update({
					table: "item",
					info: {
						is_broken,
					},
					where: `"serial_no" = '${no}'`,
				});
				if (q.errors) {
					errors.push(q.errors);
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
	transferItems,
	lendItems,
	returnItems
};
