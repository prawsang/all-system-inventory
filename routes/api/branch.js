const express = require("express");
const router = express.Router();
const Branch = require("../../models/Branch");
const Item = require("../../models/Item");
const Withdrawal = require("../../models/Withdrawal");
const Customer = require("../../models/Customer");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { check, validationResult } = require("express-validator/check");
const { query } = require("../../utils/query");

router.get("/:id/details", (req, res) => {
	const { id } = req.params;
	Branch.findOne({
		where: {
			id: {
				[Op.eq]: id
			}
		},
		include: [
			{
				model: Customer,
				as: "customer"
			}
		]
	})
		.then(branch => res.send({ branch }))
		.catch(err => res.status(500).json({ errors: err }));
});

// List of items in a branch
router.get("/:id/items/", async (req, res) => {
	const { id } = req.params;
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
		cols: `${Item.getColumns}, ${Withdrawal.getColumns}`,
		tables: `"withdrawal_has_item"
			JOIN "item" ON "item"."serial_no" = "withdrawal_has_item"."serial_no"
			JOIN "withdrawal" ON "withdrawal"."id" = "withdrawal_has_item"."withdrawal_id"
			JOIN "branch" ON "branch"."branch_code" = "withdrawal"."branch_code"
		`,
		where: `
			NOT "item"."status" = 'IN_STOCK' 
			AND NOT "item"."status" = 'RESERVED'
			AND "branch"."branch_code" = :id
			${filters ? `AND ${filters}` : ""}
			${withdrawalFilters ? `AND ${withdrawalFilters}` : ""}
			`,
		replacements: {
			id,
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

const branchValidation = [
	check("customer_code")
		.not()
		.isEmpty()
		.withMessage("Customer must be provided."),
	check("branch_code")
		.not()
		.isEmpty()
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
router.post("/add", branchValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const {
		branch_code,
		customer_code,
		name,
		address,
	} = req.body;
	Branch.create({
		branch_code,
		owner_customer_code: customer_code,
		name,
		store_type_id,
		address,
	})
		.then(rows => res.send(rows))
		.catch(err => res.status(500).json({ errors: err }));
});

// Edit Branch
router.put("/:branch_code/edit", branchValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { ibranch_coded } = req.params;
	const { name, address } = req.body;
	Branch.update(
		{
			name,
			address,
		},
		{
			where: {
				branch_code: {
					[Op.eq]: branch_code
				}
			}
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Delete branch
router.delete("/:branch_code", (req, res) => {
	const { branch_code } = req.params;
	Branch.destroy(
		{
			where: {
				branch_code: {
					[Op.eq]: branch_code
				}
			}
		},
		{
			transaction: t
		}
	)
		.then(r => res.sendStatus(200))
		.catch(err =>
			res
				.status(500)
				.json({ errors: [{ msg: "This branch cannot be deleted.", errors: err }] })
		);
});

module.exports = router;
