const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const models = require("../../models/");
const {
	Staff,
	Department,
} = models;
const { query } = require("../../utils/query");
const { check, validationResult } = require("express-validator/check");

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

router.get("/:staff_code/details", (req, res) => {
	const { staff_code } = req.params;
	Staff.findOne({
		where: {
			staff_code: {
				[Op.eq]: staff_code
			}
		},
		include: [
			{
				model: Department,
				as: "department"
			}
		]
	})
		.then(staff => res.send({ staff }))
		.catch(err => res.status(500).json({ errors: err }));
});

const staffValidation = [
	check("staff_code")
		.not()
		.isEmpty()
		.withMessage("Customer must be provided."),
	check("name")
		.not()
		.isEmpty()
		.withMessage("Branch code must be provided."),
	check("works_for_dep_code")
		.not()
		.isEmpty()
		.withMessage("Department code must be provided."),
];

// Add New Staff
router.post("/add", staffValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const {
		staff_code,
		name,
		works_for_dep_code
	} = req.body;
	Staff.create({
		staff_code,
		name,
		works_for_dep_code
	})
		.then(rows => res.send(rows))
		.catch(err => res.status(500).json({ errors: err }));
});

// Edit Staff
router.put("/:staff_code/edit", staffValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { staff_code } = req.params;
	const {
		name,
		works_for_dep_code
	} = req.body;
	Staff.update({

		name,
		works_for_dep_code
	},{
		where: {
			staff_code: {
				[Op.eq]: staff_code
			}
		}
	})
		.then(rows => res.send(rows))
		.catch(err => res.status(500).json({ errors: err }));
});

// Delete Staff
router.delete("/:staff_code/delete", (req, res) => {
	const { staff_code } = req.params;
	Staff.destroy({
		where: {
			staff_code: {
				[Op.eq]: staff_code
			}
		}
	}).then(rows => res.sendStatus(200))
	.catch(err => res.status(500).json({ errors: err }));
})

module.exports = router;