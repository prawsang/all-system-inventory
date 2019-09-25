const Sequelize = require("sequelize");
const db = require("../config/database");
const Department = require("./Department");

const Staff = db.define("staff", {
	staff_code: {
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
	works_for_dep_code: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	}
},{
	freezeTableName: "staff"
});

Staff.getColumns = `
	"staff"."staff_code",
	"staff"."name" AS "staff_name",
	"staff"."works_for_dep_code" AS "staff_department"
`;

Staff.belongsTo(Department, {
	foreignKey: "works_for_dep_code",
	as: "department"
});
Department.hasMany(Staff, {
	foreignKey: "works_for_dep_code",
	as: "staffs"
});

module.exports = Staff;
