const express = require("express");
const router = express.Router();
const Item = require("../../models/Item");
const Branch = require("../../models/Branch");
const Customer = require("../../models/Customer");
const Department = require("../../models/Department");
const Withdrawal = require("../../models/Withdrawal");
const Staff = require("../../models/Staff");
const ItemWithdrawal = require("../../models/junction/ItemWithdrawal");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../../config/database");
const { check, validationResult } = require("express-validator/check");
const { query } = require("../../utils/query");
const stockStatus = require("./stock_status");
const { installItems, transferItems, lendItems, returnItems } = stockStatus;

router.get("/get-all", async (req, res) => {
	const {
		limit,
		page,
		search_col,
		search_term,
		from,
		to,
		install_from,
		install_to,
		return_from,
		return_to,
		type,
		status
	} = req.query;
	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Withdrawal.getColumns}, ${Branch.getColumns}, ${Customer.getColumns}, ${Staff.getColumns}, ${Department.getColumns}`,
		tables: `"withdrawal"
		LEFT OUTER JOIN "branch" ON "withdrawal"."for_branch_code" = "branch"."branch_code"
		LEFT OUTER JOIN "customer" ON "branch"."owner_customer_code" = "customer"."customer_code"
		LEFT OUTER JOIN "department" ON "withdrawal"."for_department_code" = "department"."department_code"
		JOIN "staff" ON "withdrawal"."created_by_staff_code" = "staff"."staff_code"
		`,
		where: Withdrawal.filter({
			from,
			to,
			install_from,
			install_to,
			return_from,
			return_to,
			type,
			status
		}),
		replacements: {
			from,
			to,
			return_from,
			return_to,
			install_from,
			install_to,
			type,
			status
		},
		availableCols: [
			"customer_code",
			"customer_name",
			"branch_code",
			"branch_name",
			"staff_name",
			"department_code",
			"department_name"
		]
	});
	if (q.errors) {
		console.log(q.errors);
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

router.get("/:id/details", (req, res) => {
	const { id } = req.params;
	Withdrawal.findOne({
		where: { id: { [Op.eq]: id } },
		include: [
			{
				model: Branch,
				as: "branch",
				include: {
					model: Customer,
					as: "customer"
				}
			},{
				model: Staff,
				as: "staff",
			},{
				model: Department,
				as: "department",
			}
		]
	})
		.then(withdrawal =>
			res.send({
				withdrawal
			})
		)
		.catch(err => res.status(500).json({ errors: err }));
});

router.get("/:id/items", async (req, res) => {
	const { limit, page, search_col, search_term, type, is_broken, status } = req.query;
	const { id } = req.params;
	const filters = Item.filter({
		status,
		is_broken,
		type
	});

	// TODO: Join with bulk, model, and vendor tables
	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Item.getColumns}`,
		tables: `"withdrawal_has_item"
		JOIN "item" ON "withdrawal_has_item"."serial_no" = "item"."serial_no"
		`,
		where: `"withdrawal_has_item"."withdrawal_id" = :id ${filters ? `AND ${filters}` : ""}`,
		replacements: {
			id,
			status,
			is_broken,
			type
		},
		availableCols: [
			"serial_no",
			"status",
		]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

const checkWithdrawal = [
	check("type")
		.isIn(["INSTALLATION", "LENDING", "TRANSFER"])
		.withMessage("Invalid or empty type."),
	check("created_by_staff_code")
		.not()
		.isEmpty()
		.withMessage("Staff must be provided."),
	check("date")
		.not()
		.isEmpty()
		.withMessage("Withdrawal date must be provided."),
];
const checkSerial = [
	check("serial_no")
		.isArray()
		.withMessage("Invalid Serial No.")
];

// Add Withdrawal
router.post("/add", checkWithdrawal, async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const {
		for_branch_code,
		for_department,
		created_by_staff_code,
		type,
		return_by,
		install_date,
		date,
		remarks,
	} = req.body;
	const moreValidation = await Withdrawal.validate({
		type,
		return_by,
		install_date,
		for_branch_code,
		for_department,
	});
	if (moreValidation.errors.length > 0) {
		res.status(400).send(moreValidation.errors);
		return;
	}

	Withdrawal.create({
		for_branch_code: type === "TRANSFER" ? null : for_branch_code,
		for_department_code: type === "TRANSFER" ? for_department_code : null,
		created_by_staff_code,
		type,
		return_by: type === "LENDING" ? return_by : null,
		install_date: type === "INSTALLATION" ? install_date : null,
		status: "PENDING",
		remarks,
		date
	})
		.then(row => res.send(row))
		.catch(err => {
			res.status(500).json({ errors: err });
			console.log(err);
		});
});

// Edit Withdrawal (only if it is pending)
router.put("/:id/edit", checkWithdrawal, async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { id } = req.params;
	const {
		for_branch_code,
		for_department_code,
		created_by_staff_code,
		type,
		return_by,
		date,
		install_date
	} = req.body;
	const moreValidation = await Withdrawal.validate({
		type,
		return_by,
		install_date,
		for_branch_code,
		for_department_code
	});
	if (moreValidation.errors.length > 0) {
		res.status(400).json({ errors: moreValidation.errors });
		return;
	}

	// Check if Pending
	const isPending = await Withdrawal.checkStatus(id, "PENDING");
	if (!isPending) {
		res.status(400).json({ errors: [{ msg: "This withdrawal must be PENDING." }] });
		return;
	}
	Withdrawal.update(
		{
			for_branch_code: type === "TRANSFER" ? null : for_branch_code,
			for_department_code: type === "TRANSFER" ? for_department_code : null,
			created_by_staff_code,
			return_by: type === "LENDING" ? return_by : null,
			install_date: type === "INSTALLATION" ? install_date : null,
			date
		},
		{
			where: {
				id: {
					[Op.eq]: id
				}
			}
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Edit remarks (Can be edited regardless of status)
router.put("/:id/edit-remarks", (req, res) => {
	const { id } = req.params;
	const { remarks } = req.body;

	Withdrawal.update(
		{
			remarks
		},
		{
			where: {
				id: {
					[Op.eq]: id
				}
			}
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Change Status
router.put("/:id/change-status", async (req, res) => {
	const { id } = req.params;
	const { status } = req.body;

	const isPending = await Withdrawal.checkStatus(id, "PENDING");
	if (status == "CONFIRMED") {
		if (!isPending) {
			res.sendStatus(421);
			return;
		} else {
			const changeStatus = await confirmItems(id);

			if (changeStatus.length > 0) {
				res.status(500).send(changeStatus.errors);
			} else {
				res.sendStatus(200);
			}
		}
	} else if (status == "CANCELLED") {
		const changeStatus = await Withdrawal.changeStatus(id, status);
		if (changeStatus.errors.length > 0) {
			res.status(500).json({ errors: changeStatus.errors });
			return;
		} else {
			// return all items
			let items = [];
			await Withdrawal.findOne({
				where: {
					id: {
						[Op.eq]: id
					}
				},
				include: {
					model: Item,
					as: "items"
				}
			}).then(withdrawal => {
				items = withdrawal.items;
			});
			let item_serials = [];
			items.forEach(e => {
				item_serials.push(e.serial_no);
			})
			const r = await returnItems(item_serials);
			if (r.errors.length > 0) res.status(400).json({ errors: r.errors });
			else res.sendStatus(200);
		}
	} else if (status == "PENDING") {
		res.status(400).json({ errors: [{ msg: "Cannot change status to PENDING." }] });
	}
});

// Add items to withdrawal (pending only)
router.put("/:id/add-items", async (req, res) => {
	const { serial_no } = req.body;
	const { id } = req.params;

	// Get Branch Code
	let branch_code = "";

	await Withdrawal.findOne({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	}).then(res => {
		branch_code = res.branch_code;
	});

	// Check if Pending
	const isPending = await Withdrawal.checkStatus(id, "PENDING");
	if (!isPending) {
		res.status(400).json([{ msg: "This withdrawal must be PENDING." }]);
		return;
	}

	let r = null;
	let errors = [];

	const type = await Withdrawal.getType(id);
	if (type.errors) {
		res.status(500).send(type.errors);
		return;
	}

	if (type === "INSTALLATION") {
		r = await installItems(serial_no, branch_code);
	} else if (type === "TRANSFER") {
		r = await transferItems(serial_no);
	} else if (type === "LENDING") {
		r = await lendItems(serial_no);
	} else {
		res.status(400).json({ errors: [{ msg: "Withdrawal type is invalid" }] });
		return;
	}
	errors = r.errors;

	await Promise.all(
		r.updatedSerials.map(async no => {
			ItemWithdrawal.findOrCreate({
				where: {
					serial_no: no,
					withdrawal_id: id
				}
			})
				.then(r => res.sendStatus(200))
				.catch(err =>
					errors.push({
						msg: `Item ${no} cannot be added to the withdrawal.`
					})
				);
		})
	);
	if (errors.length > 0) res.status(400).json({ errors });
	else res.sendStatus(200);
});

// Remove Items from Withdrawal (Pending only)
router.put("/:id/remove-items", checkSerial, async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { serial_no } = req.body;
	const { id } = req.params;

	// Check if Pending
	const isPending = await Withdrawal.checkStatus(id, "PENDING");
	if (!isPending) {
		res.status(400).json({ errors: [{ msg: "This withdrawal must be PENDING." }] });
		return;
	}

	let errors = [];
	const r = await returnItems(serial_no);
	errors = r.errors;

	await Promise.all(
		r.updatedSerials.map(async no => {
			await ItemWithdrawal.destroy({
				where: {
					serial_no: {
						[Op.eq]: no
					},
					withdrawal_id: {
						[Op.eq]: id
					}
				}
			})
				.then(rows => null)
				.catch(err => errors.push(err));
		})
	);
	if (errors.length > 0) res.status(400).json({ errors });
	else res.sendStatus(200);
});

// Deleting withdrawals (can be done when it is cancelled).
removeAllItemsAndDelete = id => {
	return db.transaction(t => {
		return ItemWithdrawal.findAll(
			{
				where: {
					withdrawal_id: {
						[Op.eq]: id
					}
				}
			},
			{
				transaction: t
			}
		).then(r =>
			ItemWithdrawal.destroy(
				{
					where: {
						withdrawal_id: {
							[Op.eq]: id
						}
					}
				},
				{
					transaction: t
				}
			).then(rr =>
				Withdrawal.destroy(
					{
						where: {
							id: {
								[Op.eq]: id
							}
						}
					},
					{
						transaction: t
					}
				)
			)
		);
	}).then(r => ({
			errors: []
		}))
		.catch(err => ({
			errors: [{ msg: "This withdrawal cannot be deleted." }]
		}));
};

// Delete Withdrawal (only if it is pending)
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	// Check if Cancelled
	const isCancelled = await Withdrawal.checkStatus(id, "CANCELLED");
	if (!isCancelled) {
		res.status(400).json({ errors: [{ msg: "This withdrawal must be CANCELLED." }] });
		return;
	}

	// Delete items from the withdrawal
	const r = await removeAllItemsAndDelete(id);
	if (r.errors.length > 0) {
		res.status(500).json(r.errors);
	} else {
		res.sendStatus(200);
	}
});

module.exports = router;
