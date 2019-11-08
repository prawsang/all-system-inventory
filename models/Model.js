const Model = {};

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

module.exports = Model;
