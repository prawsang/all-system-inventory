// TODO: API for product type entity-type

const express = require("express");
const router = express.Router();
const models = require("../../models/");
const ProductType = models.ProductType;
const utils = require("../../utils/query");
const { check, validationResult } = require("express-validator/check");

// Required APIs
// 1. /product-type/get-all - get all product types
// 2. /product-type/add - add a product type
// 3. /product-type/edit - edit a product type
// 4. /product-type/delete - delete a product type (no cascade delete)
// Add and delete must have validation (see examples from other files)

router.get("/get-all", async (req, res) => {
	const { limit, page, search_col, search_term } = req.query;
	const q = await utils.query({
		limit,
		page,
		search_term,
		search_col,
		cols: ProductType.getColumns,
		tables: "product_type",
		availableCols: ["product_type_name"]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});
// Validation
const productValidation = [
	check("type_name")
		.not()
		.isEmpty()
		.withMessage("Type Name cannot be empty."),
];

// 2.
router.post("/add", productValidation, async (req,res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { type_name } = req.body;
	const q = await utils.insert({
		table: "product",
		info: {
			type_name
		},
		returning: "type_name"
	})
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// 3.
router.put("/:product_code/edit", productValidation, async (req,res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { type_name } = req.body;
	
	
	const q = await utils.update({
		table: "product",
		info: {
			type_name
		},
		where: `"type_name" = '${type_name}'`,
		returning: "type_name"
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
})

// 4.
router.delete("/:type_name/delete", async (req,res) => {
	const { product_code } = req.params;
	
	const q = await utils.del({
		table: "product",
		where: `"type_name" = '${type_name}'`,
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
})

module.exports = router;