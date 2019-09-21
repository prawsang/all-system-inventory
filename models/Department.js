const Sequelize = require("sequelize");
const db = require("../config/database");

const Department = db.define("customers", {
	department_code: {
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
    phone: {
		type: Sequelize.STRING,
	}
});

Department.getColumns = `"department"."department_code",
    "department"."name" AS "department_name",
    "department"."phone" AS "department_phone`;

module.exports = Department;