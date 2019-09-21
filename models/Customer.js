const Sequelize = require("sequelize");
const db = require("../config/database");

const Customer = db.define("customers", {
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
});

Customer.getColumns = `"customers"."customer_code",
	"customers"."name" AS "customer_name"`;

module.exports = Customer;
