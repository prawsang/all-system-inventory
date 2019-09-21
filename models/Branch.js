const Sequelize = require("sequelize");
const db = require("../config/database");
const Customer = require("./Customer");

const Branch = db.define("branches", {
	branch_code: {
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
	},
	address: {
		type: Sequelize.STRING
	},
	province: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	}
});

Branch.getColumns = `
	"branches"."branch_code",
	"branches"."name" AS "branch_name",
	"branches"."address",
	"branches"."province",
`;

Branch.belongsTo(Customer, {
	foreignKey: "owner_customer_code",
	as: "customer"
});
Customer.hasMany(Branch, {
	foreignKey: "owner_customer_code",
	as: "branches"
});

module.exports = Branch;
