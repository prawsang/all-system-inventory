const express = require("express");
const router = express.Router();
const utils = require("../../utils/query");
const models = require("../../models/");
const { Department, Staff } = models;
const { check, validationResult } = require("express-validator/check");

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

router.get("/:department_code/details", async (req, res) => {
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

router.get("/:department_code/staff", async (req, res) => {
	const { department_code } = req.params;
	const { limit, page, search_col, search_term } = req.query;

	const q = await utils.query({
		limit,
		page,
		search_term,
		tables: `"staff"
		JOIN "department" ON "staff"."works_for_dep_code" = "department"."department_code"`,
		where: `"department"."department_code" = '${department_code}'`,
		availableCols: ["staff_name", "staff_code"]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Validation
const depValidation = [
	check("department_code")
		.blacklist("/")
		.not().isEmpty()
		.withMessage("Department code cannot be empty."),
	check("name")
		.not().isEmpty()
		.withMessage("Supplier name cannot be empty."),
];

router.post("/add", depValidation, async (req,res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { department_code, name } = req.body;
	const q = await utils.insert({
		table: "staff",
		info: {
			department_code, 
			name
		},
		returning: "department_code"
	})
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

router.put("/:staff_code/edit", staffValidation, async (req,res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { name } = req.body;
	const { department_code } = req.params;
	
	const q = await utils.update({
		table: "staff",
		info: {
			department_code, 
			name, 
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

router.delete("/:department/delete", async (req,res) => {
	const { department } = req.params;
	
	const q = await utils.del({
		table: "department",
		where: `"department" = '${department}'`,
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
})

module.exports = router;