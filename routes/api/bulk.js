const express = require("express");
const router = express.Router();
const Item = require("../../models/Item");
const Bulk = require("../../models/Bulk");
const Model = require("../../models/Model");
const Supplier = require("../../models/Supplier");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { check, validationResult } = require("express-validator/check");
const { query } = require("../../utils/query");

// TODO: API for bulk entity-type

// Required APIs
// 1. /bulk/get-all - get all bulks
// 2. /bulk/:bulk_code/details - get details of a bulk
// 3. /bulk/:bulk_code/items - get serial numbers of the items in the bulk (use the predefined query function)
// 4. /bulk/add - (transaction) add new bulk and add items to it (code for adding items is below)
// 5. /bulk/edit - edit bulk (edit price_per_unit and of_model_code)
// 6. /bulk/delete - delete bulk (no cascade delete, meaning, cannot delete if that bulk has items)

router.get("/get-all", async (req, res) => {
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_term,
		search_col,
		cols: `${Bulk.getColumns}, ${Model.getColumns}, ${Supplier.getColumns}`,
        tables: `"bulk"
		JOIN "model" ON "bulk"."of_model_code" = "model"."model_code"
		JOIN "supplier" ON "model"."from_supplier_code" = "supplier"."supplier_code"`,
		availableCols: ["bulk_code","model_name","model_code","supplier_name","supplier_code"]
	});
	if (q.errors) {
        console.log(q.errors);
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Validation
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

// Add a bulk along with items
router.post("/add", [...bulkValidation, ...itemValidation], async (req, res) => {
    const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
    }
    
	const { remarks, serial_no } = req.body;
	// serial_no is an array of serial numbers of the items about to be added
	let errors = [];
	/* 
		The code below is for adding items into the items table
		TODO: Connect with bulk, model and supplier tables
		HINT: Make a transaction with the following steps
			1. Create a bulk
			2. Add the items (using the code below) with from_bulk_code: (the code of the bulk
				that was just created in step 1)
	*/
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

module.exports = router;