const express = require("express");
const router = express.Router();
const Item = require("../../models/Item");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { check, validationResult } = require("express-validator/check");

const checkSerial = [
	check("serial_no")
		.isArray()
		.not()
		.isEmpty()
		.withMessage("Invalid or Empty Serial No.")
];

// Install
// IN_STOCK/RESERVED -> INSTALLED
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
				await Item.findOne({
					where: {
						serial_no: {
							[Op.eq]: no
						}
					}
				}).then(async res => {
					if (res.reserved_branch_code && res.reserved_branch_code != branch_code) {
						errors.push({ msg: `The item ${no} is reserved by another branch.` });
					} else {
						await Item.update(
							{
								status: "INSTALLED",
								reserved_branch_code: null,
							},
							{
								where: {
									serial_no: {
										[Op.eq]: no
									}
								}
							}
						)
							.then(res => updatedSerials.push(no))
							.catch(err => errors.push(err));
					}
				});
			}
		})
	);
	return {
		updatedSerials,
		errors
	};
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

// Return without History (In case of editing/cancellling withdrawal)
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

// Return with History 
router.put("/return", checkSerial, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	// serial_no is an array
	const { serial_no } = req.body;

	// Transaction
	// Change status of all items in array to IN_STOCK
	// Add to return_history table (return_date, serial_no)
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
				Item.update(
					{
						is_broken
					},
					{
						where: {
							serial_no: {
								[Op.eq]: no
							}
						}
					}
				).catch(err => errors.push(err.errors));
			})
		);
		if (errors.length > 0) res.status(400).json({ errors });
		else res.sendStatus(200);
	}
);

module.exports = {
	router,
	installItems,
	transferItems,
	lendItems,
	returnItems
};
