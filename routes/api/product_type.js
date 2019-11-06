const express = require("express");
const router = express.Router();
const models = require("../../models/");
const ProductType = models.ProductType;
const utils = require("../../utils/query");
const { check, validationResult } = require("express-validator/check");

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
const productTypeValidation = [
	check("type_name")
		.blacklist("/")
		.not().isEmpty()
		.withMessage("Type name cannot be empty.")
];

router.post("/add", productTypeValidation, async (req,res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { type_name } = req.body;
	const q = await utils.insert({
		table: "product_type",
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

router.put("/:type_name/edit", productTypeValidation, async (req,res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { type_name } = req.body;
	const { type_name: type_name_params } = req.params;
	
	const q = await utils.update({
		table: "product_type",
		info: {
			type_name
		},
		where: `"type_name" = '${type_name_params}'`,
		returning: "type_name"
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
})

router.delete("/:type_name/delete", async (req,res) => {
	const { type_name } = req.params;
	
	const q = await utils.del({
		table: "product_type",
		where: `"type_name" = '${type_name}'`,
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
})

module.exports = router;