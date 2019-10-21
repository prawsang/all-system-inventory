// TODO: API for supplier entity-type

const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Supplier = require("../../models/Supplier");
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

module.exports = router;