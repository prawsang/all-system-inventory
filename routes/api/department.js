// TODO: API for department entity-type

const express = require("express");
const router = express.Router();
const utils = require("../../utils/query");
const models = require("../../models/");
const { Department, Staff } = models;
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
	const q = await utils.query({
		limit,
		page,
		search_term,
		search_col,
		cols: Department.getColumns,
        tables: "department",
		availableCols: ["department_name", "department_code"]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// 2.
router.get("/:department_code/details", async (req, res) => {
	const { department_code } = req.params;
	const q = await utils.findOne({
		cols: Department.getColumns,
		tables: "department",
		where: `"department_code" = '${department_code}'`,
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// 3.
router.get("/:department_code/staff", async (req, res) => {
	const { department_code } = req.params;
	const { limit, page, search_col, search_term } = req.query;
	const q = await utils.query({
		limit,
		page,
		search_term,
		search_col,
        cols: Staff.getColumns,
        tables: "staff",
		where: `"works_for_dep_code" = '${department_code}'`,
		availableCols: ["staff_name", "staff_code"]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Validation
const departmentValidation = [
	check("department_code")
		.not()
		.isEmpty()
		.withMessage("Department code cannot be empty."),
	check("name")
		.not()
		.isEmpty()
		.withMessage("Department name cannot be empty.")
];

// 4.
router.post("/add", departmentValidation, async (req,res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { department_code, name, phone } = req.body;
	const q = await utils.insert({
		table: "department",
		info: {
			department_code, 
			name, 
			phone
		},
		returning: "department_code"
	})
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// 5.
router.put("/:department_code/edit", departmentValidation, async (req,res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { name, phone } = req.body;
	const { department_code } = req.params;
	
	const q = await utils.update({
		table: "department",
		info: {
			department_code, 
			name, 
			phone
		},
		where: `"department_code" = '${department_code}'`,
		returning: "department_code"
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
})

// 6.
router.delete("/:department_code/delete", async (req,res) => {
	const { department_code } = req.params;
	
	const q = await utils.del({
		table: "department",
		where: `"department_code" = '${department_code}'`,
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
})

module.exports = router;