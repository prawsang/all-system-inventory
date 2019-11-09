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
	Supplier,
	Return
} = models;
const { check, validationResult } = require("express-validator/check");
const utils = require("../../utils/");

router.use("/", require("./stock_status").router);

router.route("/get-all").get(async (req, res) => {
	const { limit, page, search_col, search_term, is_broken, status, type } = req.query;

	const filters = Item.filter({
		is_broken,
		status,
		type
	});

	const q = await utils.query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Item.getColumns}, ${Model.getColumns}, ${Supplier.getColumns}, ${Bulk.getColumns}`,
		tables: `"item"
		JOIN "bulk" ON "item"."from_bulk_code" = "bulk"."bulk_code"
		JOIN "model" ON "bulk"."of_model_code" = "model"."model_code"
		JOIN "supplier" ON "supplier"."supplier_code" = "model"."from_supplier_code"`,
		where: filters,
		availableCols: [
			"serial_no",
			"supplier_code",
			"supplier_name",
			"bulk_code",
			"model_code",
			"model_name",
			"product_type_name"
		],
		replacements: {
			status: status ? status.toUpperCase() : null,
			type
		}
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

router.get("/:serial_no/details", async (req, res) => {
	const { serial_no } = req.params;

	let q = await utils.findOne({
		cols: `${Item.getColumns}, 
		${Bulk.getColumns},
		${Model.getColumns},
		${Supplier.getColumns},
		${Branch.getColumns}`,
		tables: `"item"
		JOIN "bulk" ON "bulk"."bulk_code" = "item"."from_bulk_code"
		JOIN "model" ON "model"."model_code" = "bulk"."of_model_code"
		JOIN "supplier" ON "supplier"."supplier_code" = "model"."from_supplier_code"
		LEFT OUTER JOIN "branch" ON "branch"."branch_code" = "item"."reserved_branch_code"`,
		where: `"item"."serial_no" = :serial_no`,
		replacements: {
			serial_no
		}
	});
	if (q.errors) {
		res.status(500).json(q);
		return;
	}

	const w = await utils.raw({
		string: `
		SELECT ${Withdrawal.getColumns}, 
		${Department.getColumns},
		${Branch.getColumns}, 
		${Customer.getColumns}, 
		${Staff.getColumns}
		FROM "withdrawal"
		LEFT OUTER JOIN "department" ON "withdrawal"."for_department_code" = "department"."department_code"
		LEFT OUTER JOIN "branch" ON "withdrawal"."for_branch_code" = "branch"."branch_code"
		LEFT OUTER JOIN "customer" ON "branch"."owner_customer_code" = "customer"."customer_code"
		JOIN "staff" ON "created_by_staff_code" = "staff_code"
		JOIN "withdrawal_has_item" ON "withdrawal_has_item"."withdrawal_id" = "withdrawal"."id"
		WHERE "withdrawal_has_item"."serial_no" = :serial_no
		`,
		replacements: {
			serial_no
		}
	});
	if (w.errors) {
		res.status(500).json(w);
		return;
	}

	const r = await utils.raw({
		string: `
		SELECT ${Return.getColumns}
		FROM "return_history"
		WHERE "return_history"."serial_no" = :serial_no`,
		replacements: {
			serial_no
		}
	})

	if (r.errors) {
		res.status(500).json(r);
		return;
	}

	q.withdrawals = w.rows;
	q.returns = r.rows;

	res.status(200).json(q);
});

// Get lent items
router.get("/lent", async (req, res) => {
	const { limit, page, search_col, search_term, return_to, return_from } = req.query;
	let filters = null;
	if (return_from || return_to) {
		const f = return_from ? `"withdrawal"."return_by" >= :return_from` : null;
		const t = return_to ? `"withdrawal"."return_by" <= :return_to` : null;
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
			"tm"."id"`,
		tables: `"item"
		JOIN "withdrawal_has_item" ON "withdrawal_has_item"."serial_no" = "item"."serial_no"
		JOIN "withdrawal" ON "withdrawal_has_item"."withdrawal_id" = "withdrawal"."id"
		JOIN "branch" ON "withdrawal"."for_branch_code" = "branch"."branch_code"
		JOIN "customer" ON "branch"."owner_customer_code" = "customer"."customer_code"
		JOIN (
			SELECT "serial_no", max(withdrawal.id) AS "id"
			FROM "withdrawal"
			JOIN "withdrawal_has_item" ON "withdrawal_has_item"."withdrawal_id" = "withdrawal"."id"
			GROUP BY "serial_no"
		) "tm" ON "withdrawal"."id" = "tm"."id" AND "item"."serial_no" = "tm"."serial_no"
		`,
		where: `"item"."status" = 'LENT' 
			AND "withdrawal"."type" = 'LENDING' 
			${filters ? `AND ${filters}` : ""}`,
		availableCols: ["serial_no","branch_name","branch_code","customer_name", "customer_code"],
		replacements: {
			return_from,
			return_to
		}
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Get reserved items
router.get("/reserved", async (req, res) => {
	const { limit, page, search_col, search_term, type } = req.query;

	const typeFilter = Item.filter({ type });

	const q = await utils.query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Branch.getColumns}, ${Customer.getColumns}, ${Item.getColumns}, ${Model.getColumns}`,
		tables: `"item"
		LEFT OUTER JOIN "branch" ON "item"."reserved_branch_code" = "branch"."branch_code"
		LEFT OUTER JOIN "customer" ON "branch"."owner_customer_code" = "customer"."customer_code"
		JOIN "bulk" ON "bulk"."bulk_code" = "item"."from_bulk_code"
		JOIN "model" ON "bulk"."of_model_code" = "model"."model_code"
		`,
		where: `"item"."status" = 'RESERVED' ${typeFilter ? `AND ${typeFilter}` : ""}`,
		availableCols: [
			"serial_no",
			"status",
			"branch_code",
			"branch_name",
			"customer_code",
			"customer_name",
			"model_code",
			"model_name"
		],
		replacements: {
			type
		}
	});
	if (q.errors) {
		res.status(500).json(q);
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
		.withMessage("Must specify whether the item is broken or not"),
];

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
		where: `"serial_no" = :serial_no_2`,
		returning: "serial_no",
		replacements: {
			serial_no_2: serial_no
		}
	})
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Delete Item from Stock (superadmins only)
router.delete("/:serial_no/delete", async (req, res) => {
	const { serial_no } = req.params;

	const ch = await Item.checkStatus([serial_no],"IN_STOCK");
	if (ch.errors) {
		res.status(400).json({ errors:
			[{ msg: "This item is reserved and cannot be deleted."}]
		});
		return;
	}

	const q = await utils.del({
		table: "item",
		where: `"serial_no" = :serial_no`,
		replacements: {
			serial_no
		}
	});
	if (q.errors) {
		res.status(400).json({ errors:
			[{ msg: "This item has been withdrawn and cannot be deleted."}]
		});
	} else {
		res.json(q);
	}
});

module.exports = router;
