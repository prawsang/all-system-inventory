const Sequelize = require("sequelize");
const db = require("../config/database");
const Item = require("./item");

const Return = db.define(
	"return",
	{
		serial_no: {
			type: Sequelize.STRING,
			primaryKey: true,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		return_date: {
			type: Sequelize.DATE,
			primaryKey: true,
			allowNull: false
		}
	},
	{
		freezeTableName: "return_history"
	}
);

Return.belongsTo(Item, {
	foreignKey: "serial_no",
	as: "item"
});

module.exports = Return;
