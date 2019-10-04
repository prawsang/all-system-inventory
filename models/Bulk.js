const Sequelize = require("sequelize");
const db = require("../config/database");
const Model = require("./Model");

const Bulk = db.define("bulk", {
	bulk_code: {
		type: Sequelize.STRING,
        primaryKey: true,
        validate: {
			notEmpty: true,
			notContains: "/"
		}
	},
	date_in: {
		type: Sequelize.DATE,
		allowNull: false
    },
    price_per_unit: {
		type: Sequelize.NUMERIC,
		allowNull: false
    },
    of_model_code: {
		type: Sequelize.STRING,
		allowNull: false
	},
},{
	freezeTableName: "bulk"
});

Bulk.getColumns = `
	"bulk"."bulk_code",
	"bulk"."date_in",
    "bulk"."price_per_unit",
    "bulk"."of_model_code"
`;

Bulk.belongsTo(Model, {
    foreignKey: "of_model_code",
	as: "model"
});
Model.hasMany(Bulk, {
	foreignKey: "of_model_code",
	as: "bulks"
});

module.exports = Bulk;
