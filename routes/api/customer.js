const express = require("express");
const router = express.Router();
const models = require("../../models/");
const {
	Customer,
	Branch
} = models;
const { check, validationResult } = require("express-validator/check");
const { query, update, insert, del, findOne } = require("../../utils/");

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
router.get("/:customer_code/details", async (req, res) => {
	const { customer_code } = req.params;
	const q = await findOne({
		cols: Customer.getColumns,
		tables: "customer",
		where: `"customer_code" = :customer_code`,
		replacements: {
			customer_code
		}
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
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
		availableCols: [
			"branch_code",
			"branch_name",
		],
		replacements: {
			customer_code
		}
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

const customerValidation = [
	check("customer_code")
		.blacklist("/")
		.not().isEmpty()
		.withMessage("Customer code cannot be empty."),
	check("name")
		.not()
		.isEmpty()
		.withMessage("Customer name cannot be empty.")
];

// Add New Customer
router.post("/add", customerValidation, async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { customer_code, name } = req.body;
	const q = await insert({
		table: "customer",
		info: {
			customer_code,
			name
		},
		returning: "customer_code"
	})
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Edit Customer
router.put("/:customer_code/edit", customerValidation, async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { customer_code } = req.params;
	const { name } = req.body;

	const q = await update({
		table: "customer",
		info: {
			customer_code,
			name
		},
		where: `"customer_code" = :customer_code_2`,
		returning: "customer_code",
		replacements: {
			customer_code_2: customer_code
		}
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Delete customer
router.delete("/:customer_code/delete", async (req, res) => {
	const { customer_code } = req.params;

	const q = await del({
		table: "customer",
		where: `"customer_code" = :customer_code`,
		replacements: {
			customer_code
		}
	});
	if (q.errors) {
		res.status(400).json({ errors:
			[{ msg: "This customer has items and cannot be deleted."}]
		});
	} else {
		res.json(q);
	}
});

module.exports = router;
