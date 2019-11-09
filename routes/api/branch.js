const express = require("express");
const router = express.Router();
const models = require("../../models");
const { check, validationResult } = require("express-validator/check");
const utils = require("../../utils/");

router.get("/:branch_code/details", async (req, res) => {
	const { branch_code } = req.params;
	const q = await utils.findOne({
		tables: `"branch"
		JOIN "customer" ON "branch"."owner_customer_code" = "customer"."customer_code"`,
		cols: `${models.Customer.getColumns}, ${models.Branch.getColumns}`,
		where: `"branch_code" = '${branch_code}'`,
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// List of items in a branch
router.get("/:branch_code/items/", async (req, res) => {
	const { branch_code } = req.params;
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
	const filters = models.Item.filter({
		is_broken,
		type
	});
	const withdrawalFilters = models.Withdrawal.filter({
		install_to,
		install_from,
		return_to,
		return_from
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
			JOIN "branch" ON "branch"."branch_code" = "withdrawal"."for_branch_code"
			JOIN "bulk" ON "bulk"."bulk_code" = "item"."from_bulk_code"
			JOIN "model" ON "model"."model_code" = "bulk"."of_model_code"
		`,
		where: `
			NOT "item"."status" = 'IN_STOCK' 
			AND NOT "item"."status" = 'RESERVED'
			AND "branch"."branch_code" = '${branch_code}'
			${filters ? `AND ${filters}` : ""}
			${withdrawalFilters ? `AND ${withdrawalFilters}` : ""}
			`,
		availableCols: ["serial_no"]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// // List of reserved items in a branch
router.get("/:branch_code/reserved-items", async (req, res) => {
	const { branch_code } = req.params;
	const { limit, page, search_col, search_term, type } = req.query;

	const filters = models.Item.filter({
		type
	});

	const q = await utils.query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${models.Item.getColumns}, ${models.Bulk.getColumns}, ${models.Model.getColumns}`,
		tables: `"item"
		JOIN "bulk" ON "bulk"."bulk_code" = "item"."from_bulk_code"
		JOIN "model" ON "bulk"."of_model_code" = "model"."model_code"`,
		where: `"item"."reserved_branch_code" = '${branch_code}' ${filters ? `AND ${filters}` : ""}`,
		availableCols: [
			"serial_no",
			"status",
			"bulk_code",
			"model_code",
			"model_name"
		]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

const branchValidation = [
	check("owner_customer_code")
		.blacklist("/")
		.not().isEmpty()
		.withMessage("Customer must be provided and cannot contain a /."),
	check("branch_code")
		.blacklist("/")
		.not().isEmpty()
		.withMessage("Branch code must be provided."),
	check("name")
		.not()
		.isEmpty()
		.withMessage("Branch name must be provided."),
	check("address")
		.not()
		.isEmpty()
		.withMessage("Branch address must be provided."),
];

// Add New Branch
router.post("/add", branchValidation, async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const {
		branch_code,
		owner_customer_code,
		name,
		address,
	} = req.body;
	const q = await utils.insert({
		table: "branch",
		info: {
			branch_code,
			owner_customer_code,
			name,
			address,
		},
		returning: "branch_code"
	})
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Edit Branch
router.put("/:branch_code/edit", branchValidation, async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { branch_code } = req.params;
	const { name, address } = req.body;
	const q = await utils.update({
		table: "branch",
		info: {
			branch_code,
			name,
			address
		},
		where: `"branch_code" = '${branch_code}'`,
		returning: "branch_code"
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Delete branch
router.delete("/:branch_code/delete", async (req, res) => {
	const { branch_code } = req.params;

	const q = await utils.del({
		table: "branch",
		where: `"branch_code" = '${branch_code}'`,
	});
	if (q.errors) {
		res.status(400).json({ errors:
			[{ msg: "This branch has items and cannot be deleted."}]
		});
	} else {
		res.json(q);
	}
});

module.exports = router;
