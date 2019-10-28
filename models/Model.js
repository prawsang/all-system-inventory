const Sequelize = require("sequelize");
const db = require("../config/database");
const Supplier = require("./Supplier");
const ProductType = require("./ProductType");

const Model = db.define("model", {
	model_code: {
		type: Sequelize.INTEGER,
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
},{
	freezeTableName: "model"
});

// Filtering
Model.filter = data => {
	const { type } = data;
	let typeFilter = type ? `"model"."is_product_type_name" = :type` : null;
	return typeFilter
};

Model.getColumns = `"model"."model_code" AS "model_code",
	"model"."name" AS "model_name",
	"model"."weight",
	"model"."width",
	"model"."height",
	"model"."depth",
	"model"."from_supplier_code",
	"model"."is_product_type_name"`;
	
Model.belongsTo(ProductType, {
	foreignKey: "is_product_type_name",
	as: "product_type"
});
	
Model.belongsTo(Supplier, {
	foreignKey: "from_supplier_code",
	as: "supplier"
});
Supplier.hasMany(Model, {
	foreignKey: "from_supplier_code",
	as: "models"
});

module.exports = Model;
