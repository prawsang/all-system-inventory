const Sequelize = require("sequelize");
const db = require("../config/database");

const ProductType = db.define("product_type", {
	type_name: {
		type: Sequelize.STRING,
		primaryKey: true,
		validate: {
			notEmpty: true,
			notContains: "/"
		}
	}
},{
	freezeTableName: "product_type"
});

ProductType.getColumns = `"product_type"."type_name" AS "product_type_name"`;

module.exports = ProductType;
