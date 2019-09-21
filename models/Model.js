const Sequelize = require("sequelize");
const db = require("../config/database");

const Model = db.define("model", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	weight: {
		type: Sequelize.NUMERIC,
	},
	width: {
		type: Sequelize.NUMERIC,
	},
	depth: {
		type: Sequelize.NUMERIC,
	},
	height: {
		type: Sequelize.NUMERIC,
	},
	is_product_type_name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	from_supplier_code: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	}
});

Model.getColumns = `"model"."id" AS "model_code",
    "model"."name" AS "model_name",
	"model"."type" AS "model_type"`;
	
Model.belongsTo(Supplier, {
	foreignKey: "from_supplier_code",
	as: "supplier"
});
Supplier.hasMany(Model, {
	foreignKey: "from_supplier_code",
	as: "models"
});

module.exports = Model;
