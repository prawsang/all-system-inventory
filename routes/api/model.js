const express = require("express");
const router = express.Router();
const models = require("../../models/");
const {
	Model,
	ProductType,
	Supplier,
	Bulk
} = models;
const utils = require("../../utils/");
const { check, validationResult } = require("express-validator/check");

router.route("/get-all").get(async (req, res) => {
	const { limit, page, search_col, search_term, type } = req.query;

	let filters = null;
	if (type) {
		filters = `"model"."is_product_type_name" = ${type}`;
	}

	const q = await utils.query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Model.getColumns}, ${Supplier.getColumns}, ${ProductType.getColumns}`,
		tables: `"model"
		JOIN "supplier" ON "model"."from_supplier_code" = "supplier"."supplier_code"
		JOIN "product_type" ON "model"."is_product_type_name" = "product_type"."type_name"
		`,
		where: filters ? filters : null,
		availableCols: ["model_code", "model_name", "supplier_code", "supplier_name", "product_type_name"],
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

router.route("/:model_code/details").get( async (req, res) => {
	const { model_code } = req.params;
	const q = await utils.findOne({
		cols: `${Model.getColumns}, ${Supplier.getColumns}`,
		tables: `"model"
		JOIN "supplier" ON "model"."from_supplier_code" = "supplier"."supplier_code"`,
		where: `"model_code" = '${model_code}'`,
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

router.route("/:model_code/bulks").get( async (req, res) => {
	const { model_code } = req.params;
	const q = await utils.query({
		cols: Bulk.getColumns,
		tables: "bulk",
		where: `"of_model_code" = '${model_code}'`,
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

const modelValidation = [
	check("model_code")
		.blacklist("/")
		.not()
		.isEmpty()
		.withMessage("Model code cannot be empty."),
	check("name")
		.not()
		.isEmpty()
		.withMessage("Model name cannot be empty."),
	check("from_supplier_code")
		.blacklist("/")
		.not()
		.isEmpty()
		.withMessage("Supplier code cannot be empty."),
];

// Add New Model
router.post("/add", modelValidation, async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { 
		model_code, 
		name, 
		from_supplier_code, 
		is_product_type_name, 
		width, 
		height, 
		depth, 
		weight 
	} = req.body;
	
	const q = await utils.insert({
		table: "model",
		info: {
			model_code, 
			name, 
			from_supplier_code, 
			is_product_type_name, 
			width, 
			height, 
			depth, 
			weight
		},
		returning: "model_code"
	})
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Edit Model
router.put("/:model_code/edit", async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { model_code } = req.params;
	const { 
		name,
		from_supplier_code, 
		is_product_type_name, 
		width, 
		height, 
		depth, 
		weight 
	} = req.body;
	const q = await utils.update({
		table: "model",
		info: {
			model_code,
			name,
			from_supplier_code, 
			is_product_type_name, 
			width, 
			height, 
			depth, 
			weight 
		},
		where: `"model_code" = '${model_code}'`,
		returning: "model_code"
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Delete Model
router.delete("/:model_code", async (req, res) => {
	const { model_code } = req.params;
	const q = await utils.del({
		table: "model",
		where: `"model_code" = '${model_code}'`,
	});
	if (q.errors) {
		res.status(400).json({ errors:
			[{ msg: "Cannot delete model. Some items of this model has already been withdrawn or reserved."}]
		});
	} else {
		res.json(q);
	}
});

module.exports = router;
