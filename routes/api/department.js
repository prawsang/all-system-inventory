const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const models = require("../../models/");
const {
	Department,
	Staff,
	Item,
	Withdrawal,
	Model,
	ProductType
} = models;
const { check, validationResult } = require("express-validator/check");
const { query } = require("../../utils/query");

router.get("/get-all", async (req, res) => {
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_term,
		search_col,
		cols: Department.getColumns,
		tables: "department",
		availableCols: ["department_code", "department_name"]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});
router.get("/:department_code/details", (req, res) => {
	const { department_code } = req.params;
	Department.findOne({
		where: {
			department_code: {
				[Op.eq]: department_code
			}
		}
	})
		.then(department => res.send({ department }))
		.catch(err => res.status(500).json({ errors: err }));
});

// Get Staff for Department
router.get("/:department_code/staff", async (req, res) => {
	const { department_code } = req.params;
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Staff.getColumns}`,
		tables: `"staff"`,
		where: `"staff"."works_for_dep_code" = :department_code`,
		replacements: {
			department_code
		},
		availableCols: [
			"staff_code",
			"staff_name",
		]
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
		type,
		install_from,
		install_to,
		return_from,
		return_to
	} = req.query;
	const filters = Item.filter({
		is_broken,
		type
	});
	const withdrawalFilters = Withdrawal.filter({
		install_to,
		install_from,
		return_to,
		return_from
	});
	
	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Item.getColumns}, ${Withdrawal.getColumns}, ${Model.getColumns}, ${ProductType.getColumns}`,
		tables: `"withdrawal_has_item"
			JOIN "item" ON "item"."serial_no" = "withdrawal_has_item"."serial_no"
			JOIN "withdrawal" ON "withdrawal"."id" = "withdrawal_has_item"."withdrawal_id"
			JOIN "department" ON "department"."department_code" = "withdrawal"."for_department_code"
			JOIN "bulk" ON "bulk"."bulk_code" = "item"."from_bulk_code"
			JOIN "model" ON "model"."model_code" = "bulk"."of_model_code"
			JOIN "product_type" ON "product_type"."type_name" = "model"."is_product_type_name"
		`,
		where: `
			NOT "item"."status" = 'IN_STOCK' 
			AND NOT "item"."status" = 'RESERVED'
			AND "department"."department_code" = :department_code
			${filters ? `AND ${filters}` : ""}
			${withdrawalFilters ? `AND ${withdrawalFilters}` : ""}
			`,
		replacements: {
			department_code,
			type,
			is_broken,
			install_to,
			install_from,
			return_to,
			return_from
		},
		availableCols: ["serial_no"]
	});
	if (q.errors) {
		res.status(500).json(q);
		console.log(q.errors);
	} else {
		res.json(q);
	}
});

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

// Add New Department
router.post("/add", departmentValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { department_code, name } = req.body;
	Department.create({
		department_code,
		name
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Edit Department
router.put("/:department_code/edit", departmentValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { department_code } = req.params;
	const { name } = req.body;
	Department.update(
		{
			name
		},
		{
			where: {
				department_code: {
					[Op.eq]: department_code
				}
			}
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Delete department
router.delete("/:department_code/delete", (req, res) => {
	const { department_code } = req.params;
	Department.destroy({
		where: {
			department_code: {
				[Op.eq]: department_code
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err =>
			res
				.status(500)
				.send({ errors: [{ msg: "This department cannot be deleted.", errors: err }] })
		);
});

module.exports = router;
