const express = require("express");
const router = express.Router();
const Model = require("../../models/Model");
const ProductType = require("../../models/ProductType");
const Supplier = require("../../models/Supplier");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { query } = require("../../utils/query");
const { check, validationResult } = require("express-validator/check");

router.route("/get-all").get(async (req, res) => {
	const { limit, page, search_col, search_term, type } = req.query;

	let filters = null;
	if (type) {
		filters = `"model"."is_product_type_name" = :type`;
	}

	const q = await query({
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
		replacements: {
			type
		}
	});
	if (q.errors) {
		res.status(500).json(q);
		console.log(q.errors);
	} else {
		res.json(q);
	}
});

router.route("/:id/details").get((req, res) => {
	const { id } = req.params;
	// TODO: Join with supplier and product type tables
	Model.findOne({ where: { id: { [Op.eq]: id } } })
		.then(model => {
			res.send({
				model
			});
		})
		.catch(err => res.status(500).json({ errors: err }));
});

const modelValidation = [
	check("model_code")
		.not()
		.isEmpty()
		.withMessage("Model name cannot be empty."),
	check("name")
		.not()
		.isEmpty()
		.withMessage("Model name cannot be empty."),
];

// Add New Model
router.post("/add", modelValidation, (req, res) => {
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
	Model.create({
		model_code,
		name,
		from_supplier_code,
		is_product_type_name,
		width,
		height,
		depth,
		weight,
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Edit Model
router.put("/:model_code/edit", (req, res) => {
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
	Model.update(
		{
			name,
			from_supplier_code, 
			is_product_type_name, 
			width, 
			height, 
			depth, 
			weight 
		},
		{
			where: {
				model_code: {
					[Op.eq]: model_code
				}
			}
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Delete Model
router.delete("/:model_code", (req, res) => {
	const { model_code } = req.params;
	Model.destroy({
		where: {
			model_code: {
				[Op.eq]: model_code
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

module.exports = router;
