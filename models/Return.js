const Sequelize = require("sequelize");
const db = require("../config/database");
const Item = require("./item");

const Return = db.define(
	"return_history",
	{
		serial_no: {
			type: Sequelize.STRING,
			primaryKey: true,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		return_datetime: {
			type: Sequelize.NOW,
			primaryKey: true,
			allowNull: false
		}
	},
	{
		freezeTableName: "return_history"
	}
)

Return.getColumns = `"return_history"."return_datetime"`;

module.exports = Return;
