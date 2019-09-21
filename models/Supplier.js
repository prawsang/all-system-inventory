const Sequelize = require("sequelize");
const db = require("../config/database");
const Model = require("./Model");

const Supplier = db.define("supplier", {
	supplier_code: {
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
    },
    email: {
		type: Sequelize.STRING
	},
});

Supplier.getColumns = `
	"supplier"."supplier_code",
	"supplier"."name" AS "supplier_name",
	"supplier"."phone" AS "supplier_phone",
	"supplier"."email" AS "supplier_email",
`;

module.exports = Supplier;
