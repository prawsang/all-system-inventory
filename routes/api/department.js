// TODO: API for department entity-type

const express = require("express");
const router = express.Router();
const utils = require("../../utils/query");
const models = require("../../models/");
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
		cols: models.Department.getColumns,
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
router.get("/:department_code/details", (req, res) => {
	const { department_code } = req.params;
	Department.findOne({
		where: {
			department_code:{
				[Op.eq]: department_code
			}
		}
	})
		.then(department => res.send({ department }))
		.catch(err => res.status(500).json({ errors: err }));
});

// 3.
router.get("/:department_code/staff", async (req, res) => {
	const { department_code } = req.params;
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_term,
		search_col,
        cols: `"staff"."staff_code","staff"."name"`,
        tables: `"staff"
		JOIN "department" ON "staff"."works_for_dep_code" = "department"."department_code"`,
		where: `"department"."department_code" = '${department_code}'`,
		//availableCols: ["staff_name", "staff_code"]
	});
	if (q.errors) {
        console.log(q.errors);
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

module.exports = router;