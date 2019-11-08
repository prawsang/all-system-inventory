const express = require("express");
const router = express.Router();
const models = require("../../models/");
const {
	Supplier,
	Model
} = models;
const utils = require("../../utils/");
const { check, validationResult } = require("express-validator/check");

router.get("/get-all", async (req, res) => {
	const { limit, page, search_col, search_term } = req.query;
	const q = await utils.query({
		limit,
		page,
		search_term,
		search_col,
		cols: Supplier.getColumns,
		tables: "supplier",
		availableCols: ["supplier_name", "supplier_code"]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// 2.
router.get("/:supplier_code/details", async (req, res) => {
	const { supplier_code } = req.params;
	const q = await utils.findOne({
		cols: Supplier.getColumns,
		tables: "supplier",
		where: `"supplier_code" = :supplier_code`,
		replacements: {
			supplier_code
		}
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// 3.
router.get("/:supplier_code/models", async (req, res) => {
	const { supplier_code } = req.params;
	const { limit, page, search_col, search_term, type } = req.query;

	const filters = Model.filter({
		type
	});

	const q = await utils.query({
		limit,
		page,
		search_term,
		search_col,
		cols: `${Model.getColumns}`,
		tables: `"model"`,
		where: `"model"."from_supplier_code" = :supplier_code ${filters ? `AND ${filters}` : ""}`,
		availableCols: ["model_name", "model_code"],
		replacements: {
			supplier_code
		}
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Validation
const supplierValidation = [
	check("supplier_code")
		.blacklist("/")
		.not().isEmpty()
		.withMessage("Supplier code cannot be empty."),
	check("name")
		.not()
		.isEmpty()
		.withMessage("Supplier name cannot be empty.")
];

// 4.
router.post("/add", supplierValidation, async (req,res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { supplier_code, name, phone, email } = req.body;
	const q = await utils.insert({
		table: "supplier",
		info: {
			supplier_code, 
			name, 
			phone, 
			email
		},
		returning: "supplier_code"
	})
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// 5.
router.put("/:supplier_code/edit", supplierValidation, async (req,res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { name, phone, email } = req.body;
	const { supplier_code } = req.params;
	
	const q = await utils.update({
		table: "supplier",
		info: {
			supplier_code, 
			name, 
			phone, 
			email
		},
		where: `"supplier_code" = :supplier_code_2`,
		returning: "supplier_code",
		replacements: {
			supplier_code_2: supplier_code
		}
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
})

// 6.
router.delete("/:supplier_code/delete", async (req,res) => {
	const { supplier_code } = req.params;
	
	const q = await utils.del({
		table: "supplier",
		where: `"supplier_code" = :supplier_code`,
		replacements: {
			supplier_code
		}
	});
	if (q.errors) {
		res.status(400).json({ errors:
			[{ msg: "Cannot delete supplier. Some items of this supplier has been withdrawn or reserved."}]
		});
	} else {
		res.json(q);
	}
})

module.exports = router;