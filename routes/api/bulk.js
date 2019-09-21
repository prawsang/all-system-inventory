const express = require("express");
const router = express.Router();
const Item = require("../../models/Item");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { check, validationResult } = require("express-validator/check");

// TODO: API for bulk entity-type

// Required APIs
// 1. /bulk/get-all - get all bulks
// 2. /bulk/add - (transaction) add new bulk and add items to it (code for adding items is below)
// 3. /bulk/edit - edit bulk (edit price_per_unit and of_model_code)
// 4. /bulk/delete - delete bulk (no cascade delete, meaning, cannot delete if that bulk has items)

const bulkValidation = [
    check("bulk_id")
		.not()
		.isEmpty()
		.withMessage("Bulk ID must be provided."),
	check("of_model_code")
		.not()
		.isEmpty()
		.withMessage("Model must be provided."),
	check("price_per_unit")
		.not()
		.isEmpty()
        .withMessage("Price per unit must be provided."),
    check("date_in")
		.not()
		.isEmpty()
		.withMessage("Date in must be provided."),
];
const itemValidation = [
    check("serial_no")
        .isArray()
        .not()
        .isEmpty()
		.withMessage("Serial No. of items must be provided."),
]

router.post("/add", [...bulkValidation, ...itemValidation], async (req, res) => {
    const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
    }
    
	const { remarks, serial_no } = req.body;
	let errors = [];
    // The code below is for adding items
	// TODO: Connect with bulk, model and supplier tables
	await Promise.all(
		serial_no.map(async no => {
			await Item.create({
				serial_no: no,
				model_id,
				remarks,
				status: "IN_STOCK",
				is_broken: false,
			}).catch(err => errors.push(err));
		})
    );
    // End add items code
	if (errors.length > 0) res.status(500).json({ errors });
	else res.sendStatus(200);
});
