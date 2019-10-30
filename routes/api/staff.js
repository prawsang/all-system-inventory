// TODO: API for staff entity-type

const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const models = require("../../models/");
const {
	Staff,
	Department,
	Withdrawal
} = models;
const { query } = require("../../utils/query");
const { check, validationResult } = require("express-validator/check");

// Required APIs
// 1. /staff/get-all - get all staffs
// 2. /staff/:staff_code/details - get details of a staff
// 3. /staff/:staff_code/withdrawals - get list of withdrawals this staff has created (use the predefined query function)
// 4. /staff/add - add a staff
// 5. /staff/edit - edit a staff
// 6. /staff/delete - delete a staff (no cascade delete)

router.get("/get-all", async (req, res) => {
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_term,
		search_col,
		cols: `${Staff.getColumns}, ${Department.getColumns}`,
        tables: `"staff"
        JOIN "department" ON "staff"."works_for_dep_code" = "department"."department_code"`,
		availableCols: ["staff_name", "staff_code", "department_name", "department_code"]
	});
	if (q.errors) {
        console.log(q.errors);
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

module.exports = router;