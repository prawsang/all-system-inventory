const Sequelize = require("sequelize");
const db = require("../config/database");
const Customer = require("./Customer");

const Branch = db.define("branch", {
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
	owner_customer_code: {
		type: Sequelize.STRING,
		allowNull: false
	}
},{
	freezeTableName: "branch"
});

Branch.getColumns = `
	"branch"."branch_code",
	"branch"."name" AS "branch_name",
	"branch"."address"
`;

module.exports = Branch;
