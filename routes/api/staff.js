// TODO: API for staff entity-type

const express = require("express");
const router = express.Router();
const models = require("../../models/");
const {
	Staff,
	Department,
	Withdrawal
} = models;
const utils = require("../../utils/query");
const { check, validationResult } = require("express-validator/check");

// Required APIs
// 1. /staff/get-all - get all staffs
// 2. /staff/:staff_code/details - get details of a staff
// 3. /staff/:staff_code/withdrawals - get list of withdrawals this staff has created (use the predefined query function)
// 4. /staff/add - add a staff
// 5. /staff/edit - edit a staff
// 6. /staff/delete - delete a staff (no cascade delete)

// 1.
router.get("/get-all", async (req, res) => {
	const { limit, page, search_col, search_term } = req.query;
	const q = await utils.query({
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
		res.status(500).json(q);
	} else {
		res.json(q);
	}
})

// 2.
router.get("/:staff_code/details", async (req, res) => {
	const { staff_code } = req.params;
	const q = await utils.findOne({
		cols: `${Staff.getColumns}, ${Department.getColumns}`,
		tables: `"staff"
        JOIN "department" ON "staff"."works_for_dep_code" = "department"."department_code"`,
		where: `"staff"."staff_code" = '${staff_code}'`,
		availableCols: ["staff_name", "staff_code", "department_name", "department_code"]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
})

// 3.

// Validation
const staffValidation = [
	check("staff_code")
		.not()
		.isEmpty()
		.withMessage("Staff code cannot be empty."),
	check("name")
		.not()
		.isEmpty()
		.withMessage("Staff name cannot be empty."),
	check("works_for_dep_code")
		.not()
		.isEmpty()
		.withMessage("Staff department code cannot be empty.")
];

// 4.
router.post("/add", staffValidation, async (req,res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { staff_code, name, works_for_dep_code } = req.body;
	const q = await utils.insert({
		table: "staff",
		info: {
			staff_code, 
			name, 
			works_for_dep_code
		},
		returning: "staff_code"
	})
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// 5.
router.put("/:staff_code/edit", staffValidation, async (req,res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { name, works_for_dep_code } = req.body;
	const { staff_code } = req.params;
	
	const q = await utils.update({
		table: "staff",
		info: {
			staff_code, 
			name, 
			works_for_dep_code
		},
		where: `"staff_code" = '${staff_code}'`,
		returning: "staff_code"
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
})

// 6.
router.delete("/:staff_code/delete", async (req,res) => {
	const { staff_code } = req.params;
	
	const q = await utils.del({
		table: "staff",
		where: `"staff_code" = '${staff_code}'`,
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
})

module.exports = router;