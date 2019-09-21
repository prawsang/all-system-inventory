const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Customer = require("../../models/Customer");
const Branch = require("../../models/Branch");
const { check, validationResult } = require("express-validator/check");
const { query } = require("../../utils/query");

router.get("/get-all", async (req, res) => {
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_term,
		search_col,
		cols: Customer.getColumns,
		tables: "customer",
		availableCols: ["customer_code", "customer_name"]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});
router.get("/:customer_code/details", (req, res) => {
	const { customer_code } = req.params;
	Customer.findOne({
		where: {
			customer_code: {
				[Op.eq]: customer_code
			}
		}
	})
		.then(customer => res.send({ customer }))
		.catch(err => res.status(500).json({ errors: err }));
});

// Get Branches for Customer
router.get("/:customer_code/branches", async (req, res) => {
	const { customer_code } = req.params;
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Branch.getColumns}`,
		tables: `"branch"`,
		where: `"branch"."owner_customer_code" = :customer_code`,
		replacements: {
			customer_code
		},
		availableCols: [
			"branch_code",
			"branch_name",
		]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

const customerValidation = [
	check("customer_code")
		.not()
		.isEmpty()
		.withMessage("Customer code cannot be empty."),
	check("name")
		.not()
		.isEmpty()
		.withMessage("Customer name cannot be empty.")
];

// Add New Customer
router.post("/add", customerValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { customer_code, name } = req.body;
	Customer.create({
		customer_code,
		name
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Edit Customer
router.put("/:customer_code/edit", customerValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { customer_code } = req.params;
	const { name } = req.body;
	Customer.update(
		{
			name
		},
		{
			where: {
				customer_code: {
					[Op.eq]: customer_code
				}
			}
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Delete customer
router.delete("/:customer_code/delete", (req, res) => {
	const { customer_code } = req.params;
	Customer.destroy({
		where: {
			customer_code: {
				[Op.eq]: customer_code
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err =>
			res
				.status(500)
				.send({ errors: [{ msg: "This customer cannot be deleted.", errors: err }] })
		);
});

module.exports = router;
