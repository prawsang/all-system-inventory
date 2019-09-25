const Sequelize = require("sequelize");
const db = require("../config/database");

const Customer = db.define("customer", {
	customer_code: {
		type: Sequelize.STRING,
		primaryKey: true,
		validate: {
			notEmpty: true,
			notContains: "/"
		}
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	}
},{
	freezeTableName: "customer"
});

Customer.getColumns = `"customer"."customer_code",
	"customer"."name" AS "customer_name"`;

module.exports = Customer;
