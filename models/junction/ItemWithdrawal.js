const Sequelize = require("sequelize");
const db = require("../../config/database");
const Item = require("../item");
const Withdrawal = require("../Withdrawal");

const ItemWithdrawal = db.define(
	"withdrawal_has_item",
	{
		serial_no: {
			type: Sequelize.STRING,
			primaryKey: true,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		withdrawal_id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			allowNull: false
		}
	},
	{
		freezeTableName: "withdrawal_has_item"
	}
);

ItemWithdrawal.belongsTo(Item, {
	foreignKey: "serial_no",
	as: "item"
});
ItemWithdrawal.belongsTo(Withdrawal, {
	foreignKey: "withdrawal_id",
	otherKey: "id",
	as: "withdrawal"
});

module.exports = ItemWithdrawal;
