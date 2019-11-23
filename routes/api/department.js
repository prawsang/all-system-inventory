const express = require("express");
const router = express.Router();
const utils = require("../../utils/");
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
	const { department_code } = req.params;
	const q = await utils.findOne({
		cols: models.Department.getColumns,
		tables: "department",
		where: `"department_code" = :department_code`,
		replacements: {
			department_code
		}
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
		search_col,
		cols: models.Staff.getColumns,
		tables: `"staff"
		JOIN "department" ON "staff"."works_for_dep_code" = "department"."department_code"`,
		where: `"department"."department_code" = :department_code`,
		availableCols: ["staff_name", "staff_code"],
		replacements: {
			department_code
		}
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// List of items in a department
router.get("/:department_code/items/", async (req, res) => {
	const { department_code } = req.params;
	const {
		limit,
		page,
		search_col,
		search_term,
		is_broken,
		type
	} = req.query;
	const filters = models.Item.filter({
		is_broken,
		type
	});
	
	const q = await utils.query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${models.Item.getColumns}, ${models.Withdrawal.getColumns}, ${models.Model.getColumns}`,
		tables: `"withdrawal_has_item"
			JOIN "item" ON "item"."serial_no" = "withdrawal_has_item"."serial_no"
			JOIN "withdrawal" ON "withdrawal"."id" = "withdrawal_has_item"."withdrawal_id"
			JOIN "department" ON "department"."department_code" = "withdrawal"."for_department_code"
			JOIN "bulk" ON "bulk"."bulk_code" = "item"."from_bulk_code"
			JOIN "model" ON "model"."model_code" = "bulk"."of_model_code"
			JOIN (
				SELECT "serial_no", max(withdrawal.id) AS "id"
				FROM "withdrawal"
				JOIN "withdrawal_has_item" ON "withdrawal_has_item"."withdrawal_id" = "withdrawal"."id"
				GROUP BY "serial_no"
			) "tm" ON "withdrawal"."id" = "tm"."id" AND "item"."serial_no" = "tm"."serial_no"
		`,
		where: `
			"item"."status" = 'TRANSFERRED'
			AND "department"."department_code" = :department_code
			${filters ? `AND ${filters}` : ""}
			`,
		availableCols: ["serial_no", "model_name"],
		replacements: {
			department_code,
			type
		}
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
		table: "department",
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

router.put("/:department_code/edit", depValidation, async (req,res) => {
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
		where: `"department_code" = :department_code_2`,
		returning: "department_code",
		replacements: {
			department_code_2: department_code
		}
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
})

router.delete("/:department_code/delete", async (req,res) => {
	const { department_code } = req.params;
	
	const q = await utils.del({
		table: "department",
		where: `"department_code" = :department_code`,
		replacements: {
			department_code
		}
	});
	if (q.errors) {
		res.status(400).json({ errors:
			[{ msg: "This department has staff and/or items and cannot be deleted."}]
		});
	} else {
		res.json(q);
	}
})

module.exports = router;