// TODO: API for supplier entity-type

const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const models = require("../../models/");
const {
	Supplier,
	Model,
	ProductType
} = models;
const { query } = require("../../utils/query");
const { check, validationResult } = require("express-validator/check");

// Required APIs
// 1. /supplier/get-all - get all suppliers
// 2. /supplier/:supplier_code/details - get details of a supplier
// 3. /supplier/:supplier_code/models - get all models this supplier sells (include product_type) (use the predefined query function)
// 4. /supplier/add - add a supplier
// 5. /supplier/edit - edit a supplier
// 6. /supplier/delete - delete a supplier (no cascade delete)

router.get("/get-all", async (req, res) => {
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_term,
		search_col,
		cols: Supplier.getColumns,
		tables: "supplier",
		availableCols: ["supplier_name", "supplier_code"]
	});
	if (q.errors) {
        console.log(q.errors);
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// 2.
router.get("/:supplier_code/details", (req, res) => {
	const { supplier_code } = req.params;
	Supplier.findOne({
		where: {
			supplier_code: {
				[Op.eq]: supplier_code
			}
		}
	})
		.then(supplier => res.send({ supplier }))
		.catch(err => res.status(500).json({ errors: err }));
});

// 3.
router.get("/:supplier_code/models", async (req, res) => {
	const { supplier_code } = req.params;
	const { limit, page, search_col, search_term, type } = req.query;

	const filters = Model.filter({
		type
	});

	const q = await query({
		limit,
		page,
		search_term,
		search_col,
		cols: `${Model.getColumns}, ${ProductType.getColumns}`,
		tables: `"model"
		JOIN "product_type" ON "model"."is_product_type_name" = "product_type"."type_name"`,
		where: `"model"."from_supplier_code" = :supplier_code ${filters ? `AND ${filters}` : ""}`,
		availableCols: ["model_name", "model_code"],
		replacements: {
			supplier_code,
			type
		}
	});
	if (q.errors) {
        console.log(q.errors);
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Validation
const supplierValidation = [
	check("supplier_code")
		.not()
		.isEmpty()
		.withMessage("Supplier code cannot be empty."),
	check("name")
		.not()
		.isEmpty()
		.withMessage("Supplier name cannot be empty.")
];

// 4.
router.post("/add", supplierValidation, (req,res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { supplier_code, name, phone, email } = req.body;
	Supplier.create({
		supplier_code,
		name,
		phone,
		email
	}).then(rows => res.sendStatus(200))
	.catch(err => res.status(500).json({ errors: err }));
});

// 5.
router.put("/:supplier_code/edit", supplierValidation, (req,res) => {
	const validationErrors = validationResult(req);
	if (!validatoinErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { name, phone, email } = req.body;
	const { supplier_code } = req.params;
	Supplier.update({
		name,
		email,
		phone
	},{
		where: {
			supplier_code: {
				[Op.eq]: supplier_code
			}
		}
	}).then(rows => res.sendStatus(200))
	.catch(err => res.status(500).json({ errors: err }));
})

// 6.
router.delete("/:supplier_code/delete", (req,res) => {
	const { supplier_code } = req.params;
	Supplier.destroy({
		where: {
			supplier_code: {
				[Op.eq]: supplier_code
			}
		}
	}).then(rows => res.sendStatus(200))
	.catch(err => res.status(500).json({ errors: err }));
})

module.exports = router;