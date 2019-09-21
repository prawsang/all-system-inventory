const Sequelize = require("sequelize");
const db = require("../config/database");

const ProductType = db.define("product_type", {
	name: {
		type: Sequelize.STRING,
		primaryKey: true,
		validate: {
			notEmpty: true,
			notContains: "/"
		}
	}
});

ProductType.getColumns = `"product_type"."name" AS "product_type"`;

module.exports = ProductType;
