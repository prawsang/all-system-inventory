const Withdrawal = {};
const utils = require("../utils/");
const Item = require("./Item");

Withdrawal.getColumns = `"withdrawal"."id" AS "withdrawal_id",
	"withdrawal"."for_branch_code",
	"withdrawal"."for_department_code",
    "withdrawal"."created_by_staff_code",
    "withdrawal"."type" AS "withdrawal_type",
    "withdrawal"."date" AS "withdrawal_date",
    "withdrawal"."install_date",
    "withdrawal"."return_by",
    "withdrawal"."status" AS "withdrawal_status",
    "withdrawal"."remarks" AS "withdrawal_remarks"`;

// Class Methods
Withdrawal.validate = data => {
	const { type, return_by, install_date, for_branch_code, for_department_code } = data;

	let errors = [];
	if (type == "LENDING" && (!return_by || return_by == "")) {
		errors.push({ msg: "Return date is required for lending." });
	}
	if (type == "INSTALLATION" && (!install_date || install_date == "")) {
		errors.push({ msg: "Installation date is required for installation." });
	}
	if (type == "TRANSFER" && (!for_department_code)) {
		errors.push({ msg: "Department code required for transferring"});
	}
	if (type !== "TRANSFER" && (!for_branch_code)) {
		errors.push({ msg: "Branch code required for lending or installation"});
	}
	return { errors };
};

Withdrawal.getType = async withdrawal_id => {
	const q = await utils.findOne({
		tables: "withdrawal",
		cols: Withdrawal.getColumns,
		where: `"id" = :withdrawal_id`,
		replacements: {
			withdrawal_id
		}
	})
	if (q.errors) {
		return { errors: err }
	} else {
		if (q.row) {
			return q.row.withdrawal_type
		} else {
			return { errors: [{ msg: "Withdrawal not found. "}]}
		}
	}
};
Withdrawal.checkStatus = async (id, status) => {
	const q = await utils.findOne({
		tables: "withdrawal",
		cols: Withdrawal.getColumns,
		where: `"id" = :id`,
		replacements: {
			id
		}
	})
	if (q.errors) {
		return false
	} else {
		if (q.row) {
			if (q.row.withdrawal_status !== status) return false;
			return true
		} else {
			return false
		}
	}
};
Withdrawal.checkItem = async (id, serial_no) => {
	const q = await utils.findOne({
		tables: "withdrawal_has_item",
		cols: Item.getColumns,
		where: `"withdrawal_id" = :id AND "serial_no" = :serial_no`,
		replacements: {
			id,
			serial_no
		}
	})
	if (q.errors) {
		return false
	} else {
		if (q.rows.data) {
			return true
		} else {
			return false
		}
	}
};
Withdrawal.changeStatus = async (id, status) => {
	const q = await utils.update({
		table: "withdrawal",
		info: {
			status
		},
		where: `"id" = :id`,
		replacements: {
			id
		}
	})
	if (q.errors) {
		return q.errors
	} else {
		return { errors: [] }
	}
};

Withdrawal.filter = data => {
	const {
		from,
		to,
		install_from,
		install_to,
		return_from,
		return_to,
		type,
		status,
		staff_code
	} = data;

	let dateFilter = null;
	let returnDateFilter = null;
	let installDateFilter = null;
	let statusFilter = null;
	let typeFilter = null;
	let staffCodeFilter = null;

	if (from || to) {
		const f = from ? `"withdrawal"."date" >= :from` : null;
		const t = to ? `"withdrawal"."date" <= :to` : null;
		dateFilter = [f, t].filter(e => e).join(" AND ");
	}
	if (install_from || install_to) {
		const f = install_from ? `"withdrawal"."install_date" >= :install_from` : null;
		const t = install_to ? `"withdrawal"."install_date" <= :install_to` : null;
		installDateFilter = [f, t].filter(e => e).join(" AND ");
	}
	if (return_from || return_to) {
		const f = return_from ? `"withdrawal"."return_by" >= :return_from` : null;
		const t = return_to ? `"withdrawal"."return_by" <= :return_to` : null;
		returnDateFilter = [f, t].filter(e => e).join(" AND ");
	}
	if (type) {
		typeFilter = `"withdrawal"."type" = :type`;
	}
	if (status) {
		statusFilter = `"withdrawal"."status" = :status`;
	}
	if (staff_code) {
		staffCodeFilter = `"withdrawal"."created_by_staff_code" = :staff_code`;
	}

	return [dateFilter, returnDateFilter, installDateFilter, typeFilter, statusFilter, staffCodeFilter]
		.filter(e => e)
		.join(" AND ");
};

module.exports = Withdrawal;
