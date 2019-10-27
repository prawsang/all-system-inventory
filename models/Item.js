const Sequelize = require("sequelize");
const db = require("../config/database");
const Bulk = require("./Bulk");
const Branch = require("./Branch");
const Op = Sequelize.Op;

const Item = db.define(
	"item",
	{
		serial_no: {
			type: Sequelize.STRING,
			primaryKey: true,
			validate: {
				notEmpty: true,
				notContains: "/"
			}
		},
		remarks: {
			type: Sequelize.STRING
		},
		reserved_branch_code: {
			type: Sequelize.INTEGER
		},
		status: {
			type: Sequelize.ENUM,
			values: ["IN_STOCK", "INSTALLED", "RESERVED", "LENT", "TRANSFERRED", "PENDING"],
			allowNull: false,
			validate: {
				notEmpty: true,
				isIn: [["IN_STOCK", "INSTALLED", "RESERVED", "LENT", "TRANSFERRED", "PENDING"]]
			}
		},
		is_broken: {
			type: Sequelize.BOOLEAN,
			allowNull: false
		},
		from_bulk_code: {
			type:Sequelize.STRING,
			allowNull: false
		}
	},{
		freezeTableName: "item"
	}
);
Item.getColumns = `"item"."serial_no",
    "item"."remarks",
    "item"."reserved_branch_code",
    "item"."status",
	"item"."is_broken",
	"item"."from_bulk_code"`;

// Class Methods

// Change status of multiple items
// This will check if the items are of a valid status, and change those of valid statuses only.
Item.changeStatus = async params => {
	const { serial_no, validStatus, toStatus, otherInfo } = params;
	let updatedSerials = [];
	let errors = [];
	if (serial_no.length == 0)
		return { updatedSerials, errors: [{ msg: "Serial No. cannot be empty." }] };

	await Promise.all(
		serial_no.map(async no => {
			let valid = true;
			if (validStatus) {
				valid = await Item.checkStatus(no, validStatus);
			}
			if (valid) {
				await Item.update(
					{
						status: toStatus,
						...otherInfo
					},
					{
						where: {
							serial_no: {
								[Op.eq]: no
							}
						}
					}
				)
					.then(res => updatedSerials.push(no))
					.catch(err => errors.push(err));
			} else {
				errors.push({ msg: `The ${no} item is not ${validStatus[0]}` });
			}
		})
	);
	return {
		updatedSerials,
		errors
	};
};

// Check if the item's (single item) is of a status
Item.checkStatus = (serial_no, status) => {
	if (typeof status == "string") status = [status];
	return Item.findOne({
		where: {
			serial_no: {
				[Op.eq]: serial_no
			}
		}
	})
		.then(item => {
			if (item) {
				if (status.indexOf(item.status) >= 0) return true;
			}
		})
		.catch(err => false);
};

// Filtering
Item.filter = data => {
	const { is_broken, status } = data;
	let brokenFilter = is_broken
		? is_broken === "true"
			? `"item"."is_broken"`
			: `NOT "item"."is_broken"`
		: null;
	let statusFilter = status ? `"item"."status" = :status` : null;

	// TODO: Add filtering for an item's type

	return [brokenFilter, statusFilter].filter(e => e).join(" AND ");
};

// Associations
Item.belongsTo(Branch, {
	foreignKey: "reserved_branch_code",
	as: "reserve_branch"
});
Item.belongsTo(Bulk, {
	foreignKey: "from_bulk_code",
	as: "bulk"
});
Bulk.hasMany(Item, {
	foreignKey: "from_bulk_code"
})

module.exports = Item;
