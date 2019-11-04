const express = require("express");
const router = express.Router();
const models = require("../../models/");
const {
	Item,
	Branch,
	Customer,
	Department,
	Withdrawal,
	Bulk,
	Model,
	Staff,
	ProductType,
	Supplier,
	Return
} = models;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { check, validationResult } = require("express-validator/check");
const utils = require("../../utils/query");

router.use("/", require("./stock_status").router);

router.route("/get-all").get(async (req, res) => {
	const { limit, page, search_col, search_term, is_broken, status, type } = req.query;

	const filters = Item.filter({
		is_broken,
		status: status ? status.toUpperCase() : null,
		type
	});

	// TODO: Join with bulk, model and supplier tables
	const q = await utils.query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Item.getColumns}`,
		tables: `"item"`,
		where: filters,
		availableCols: [
			"serial_no"
		]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

router.get("/:serial_no/details", async (req, res) => {
	// TODO: Include return history along with withdrawal history. Sort by date newest to oldest.
	const { serial_no } = req.params;

	const q = await utils.findOne({
		cols: `${Item.getColumns}, 
		${Bulk.getColumns},
		${Model.getColumns},
		${Supplier.getColumns}`,
		tables: `"item"
		JOIN "bulk" ON "bulk"."bulk_code" = "item"."from_bulk_code"
		JOIN "model" ON "model"."model_code" = "bulk"."of_model_code"
		JOIN "supplier" ON "supplier"."supplier_code" = "model"."from_supplier_code"`,
		where: `"item"."serial_no" = '${serial_no}'`,
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Get lent items
router.get("/lent", async (req, res) => {
	const { limit, page, search_col, search_term, return_to, return_from } = req.query;
	let filters = null;
	if (return_from || return_to) {
		const f = return_from ? `"withdrawal"."return_by" >= '${return_from}'` : null;
		const t = return_to ? `"withdrawal"."return_by" <= '${return_to}'` : null;
		filters = [f, t].filter(e => e).join(" AND ");
	}

	const q = await utils.query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Item.getColumns},
			${Withdrawal.getColumns},
			${Branch.getColumns},
			${Customer.getColumns},
			"tm"."return_by"`,
		tables: `"item"
		JOIN "withdrawal_has_item" ON "withdrawal_has_item"."serial_no" = "item"."serial_no"
		JOIN "withdrawal" ON "withdrawal_has_item"."withdrawal_id" = "withdrawal"."id"
		JOIN "branch" ON "withdrawal"."for_branch_code" = "branch"."branch_code"
		JOIN "customer" ON "branch"."owner_customer_code" = "customer"."customer_code"
		JOIN (
			SELECT "serial_no", max(withdrawal.return_by) AS "return_by"
			FROM "withdrawal"
			JOIN "withdrawal_has_item" ON "withdrawal_has_item"."withdrawal_id" = "withdrawal"."id"
			GROUP BY "serial_no"
		) "tm" ON "withdrawal"."return_by" = "tm"."return_by" AND "item"."serial_no" = "tm"."serial_no"
		`,
		where: `"item"."status" = 'LENT' 
			AND "withdrawal"."type" = 'LENDING' 
			${filters ? `AND ${filters}` : ""}`,
		availableCols: ["serial_no","branch_name","branch_code"]
	});
	if (q.errors) {
		res.status(500).json(q);
		console.log(q.errors);
	} else {
		res.json(q);
	}
});

// Get reserved items
router.get("/reserved", async (req, res) => {
	const { limit, page, search_col, search_term, type } = req.query;

	const typeFilter = Item.filter({ type });

	// TODO: Join with bulk, model and supplier tables
	const q = await utils.query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Branch.getColumns}, ${Customer.getColumns}, ${Item.getColumns}`,
		tables: `"item"
		LEFT OUTER JOIN "branch" ON "item"."reserved_branch_code" = "branch"."branch_code"
		LEFT OUTER JOIN "customer" ON "branch"."owner_customer_code" = "customer"."customer_code"
		`,
		where: `"item"."status" = 'RESERVED' ${typeFilter ? `AND ${typeFilter}` : ""}`,
		availableCols: [
			"serial_no",
			"status",
			"branch_code",
			"branch_name",
			"customer_code",
			"customer_name"
		]
	});
	if (q.errors) {
		res.status(500).json(q);
		console.log(q.errors)
	} else {
		res.json(q);
	}
});

const stockValidation = [
	check("serial_no")
		.blacklist("/")
		.not().isEmpty()
		.withMessage("Serial No. be provided."),
	check("from_bulk_code")
		.blacklist("/")
		.not().isEmpty()
		.withMessage("Bulk Code must be provided."),
	check("is_broken")
		.isBoolean()
		.withMessage("Bulk Code must be provided."),
];

// Add Item To A Bulk
router.post("/add", stockValidation, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { serial_no, remarks, is_broken, from_bulk_code } = req.body;
	const q = await utils.insert({
		table: "item",
		info: {
			serial_no,
			from_bulk_code,
			remarks,
			is_broken,
			reserved_branch_code: null,
			status: "IN_STOCK"
		},
		returning: "serial_no"
	})
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Edit Item
router.put("/:serial_no/edit", stockValidation, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { serial_no } = req.params;
	const { remarks, is_broken, from_bulk_code } = req.body;
	const q = await utils.update({
		table: "item",
		info: {
			serial_no,
			from_bulk_code,
			remarks,
			is_broken
		},
		returning: "serial_no"
	})
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Delete Item from Stock (superadmins only)
router.delete("/:serial_no", async (req, res) => {
	const { serial_no } = req.params;

	const q = await del({
		table: "item",
		where: `"serial_no" = '${serial_no}'`,
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

module.exports = router;
