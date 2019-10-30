// TODO: API for product type entity-type

const express = require("express");
const router = express.Router();
const models = require("../../models/");
const ProductType = models.ProductType;
const { query } = require("../../utils/query");
const { check, validationResult } = require("express-validator/check");

// Required APIs
// 1. /product-type/get-all - get all product types
// 2. /product-type/add - add a product type
// 3. /product-type/edit - edit a product type
// 4. /product-type/delete - delete a product type (no cascade delete)
// Add and delete must have validation (see examples from other files)

router.get("/get-all", async (req, res) => {
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_term,
		search_col,
		cols: ProductType.getColumns,
		tables: "product_type",
		availableCols: ["product_type_name"]
	});
	if (q.errors) {
        console.log(q.errors);
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

module.exports = router;