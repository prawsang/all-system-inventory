// TODO: API for department entity-type

const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
// const Staff = require("../../models/Staff");
const Department = require("../../models/Department");
const { query } = require("../../utils/query");
const { check, validationResult } = require("express-validator/check");

// Required APIs
// 1. /department/get-all - get all departments
// 2. /department/:department_code/details - get a department's details
// 3. /department/:department_code/staff - get staff in the department (use predefined query functions)
// 4. /department/add - add a department
// 5. /department/edit - edit a department
// 6. /department/delete - delete a department (no cascade delete)

router.get("/get-all", async (req, res) => {
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_term,
		search_col,
		cols: Department.getColumns,
        tables: "department",
		availableCols: ["department_name", "department_code"]
	});
	if (q.errors) {
        console.log(q.errors);
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

module.exports = router;