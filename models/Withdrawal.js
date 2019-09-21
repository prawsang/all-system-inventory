const Sequelize = require("sequelize");
const db = require("../config/database");
const Staff = require("./Staff");
const Branch = require("./Branch");
const Item = require("./Item");
const Op = Sequelize.Op;

const Withdrawal = db.define("withdrawal", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	branch_code: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	created_by_staff_code: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	type: {
		type: Sequelize.ENUM,
		values: ["INSTALLATION", "LENDING", "TRANSFER"],
		allowNull: false,
		validate: {
			notEmpty: true,
			isIn: [["INSTALLATION", "LENDING", "TRANSFER"]]
		}
	},
	date: {
		type: Sequelize.DATE,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	install_date: {
		type: Sequelize.DATE
	},
	status: {
		type: Sequelize.ENUM,
		values: ["PENDING", "CONFIRMED", "CANCELLED"],
		allowNull: false,
		validate: {
			notEmpty: true,
			isIn: [["PENDING", "CONFIRMED", "CANCELLED"]]
		}
	},
	remarks: {
		type: Sequelize.STRING
	},
	return_by: {
		type: Sequelize.DATE
	},
});
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
	const { type, return_by, install_date } = data;
	let errors = [];
	if (type == "LENDING" && (!return_by || return_by == "")) {
		errors.push({ msg: "Return date is required for lending." });
	}
	if (type == "INSTALLATION" && (!install_date || install_date == "")) {
		errors.push({ msg: "Installation date is required for installation." });
	}
	return { errors };
};
Withdrawal.getType = withdrawal_id => {
	return Withdrawal.findOne({
		where: {
			id: {
				[Op.eq]: withdrawal_id
			}
		}
	})
		.then(withdrawal => withdrawal.type)
		.catch(err => ({ errors: err }));
};
Withdrawal.checkStatus = (id, status) => {
	return Withdrawal.findOne({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	})
		.then(withdrawal => {
			if (withdrawal.status !== status) {
				return false;
			} else return true;
		})
		.catch(err => false);
};
Withdrawal.checkItem = (id, serial_no) => {
	return Withdrawal.count({
		where: {
			id: {
				[Op.eq]: id
			}
		},
		include: {
			model: Item,
			as: "items",
			where: {
				serial_no: {
					[Op.eq]: serial_no
				}
			}
		}
	})
		.then(count => (count > 0 ? true : false))
		.catch(err => false);
};
Withdrawal.changeStatus = (id, status) => {
	return Withdrawal.update(
		{
			status
		},
		{
			where: {
				id: {
					[Op.eq]: id
				}
			}
		}
	)
		.then(rows => ({ errors: [] }))
		.catch(err => ({ errors: [err] }));
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
		status
	} = data;

	let dateFilter = null;
	let returnDateFilter = null;
	let installDateFilter = null;
	let statusFilter = null;
	let typeFilter = null;

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

	return [dateFilter, returnDateFilter, installDateFilter, typeFilter, statusFilter]
		.filter(e => e)
		.join(" AND ");
};

// Associations

Withdrawal.belongsTo(Branch, {
	foreignKey: "branch_code",
	as: "branch"
});
Branch.hasMany(Withdrawal, {
	foreignKey: "branch_code",
	as: "withdrawals"
});

Withdrawal.belongsTo(Staff, {
	foreignKey: "created_by_staff_code",
	as: "staff"
});
Staff.hasMany(Withdrawal, {
	foreignKey: "created_by_staff_code",
	as: "withdrawals"
});

Withdrawal.belongsToMany(Item, {
	through: "withdrawal_has_item",
	foreignKey: "withdrawal_id",
	otherKey: "serial_no",
	as: "items"
});
Item.belongsToMany(Withdrawal, {
	through: "withdrawal_has_item",
	foreignKey: "serial_no",
	otherKey: "withdrawal_id",
	as: "withdrawals"
});

module.exports = Withdrawal;
