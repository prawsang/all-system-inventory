const express = require("express");
const router = express.Router();
const models = require("../../models/");
const {
	Model,
	ProductType,
	Supplier,
	Bulk
} = models;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { query } = require("../../utils/query");
const { check, validationResult } = require("express-validator/check");

router.get("/:model_code/details", (req, res) => {
	const { model_code } = req.params;
	Model.findOne({ 
		where: { model_code: { [Op.eq]: model_code } },
		include: [{
			model: Supplier,
			as: "supplier"
		}]
	})
		.then(model => {
			res.send({
				model
			});
		})
		.catch(err => res.status(500).json({ errors: err }));
});

router.get("/:model_code/bulks", async (req, res) => {
	const { model_code } = req.params;
	const { limit, page, search_col, search_term,from, to } = req.query;

	let dateFilter = null;

	if (from || to) {
		const f = from ? `"bulk"."date_in" >= :from` : null;
		const t = to ? `"bulk"."date_in" <= :to` : null;
		dateFilter = [f, t].filter(e => e).join(" AND ");
	}

	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Bulk.getColumns}`,
		tables: "bulk",
		where: `"bulk"."of_model_code" = :model_code ${dateFilter ? `AND ${dateFilter}` : ""}`,
		availableCols: ["bulk_code"],
		replacements: {
			model_code,
			from,
			to
		}
	});
	if (q.errors) {
		res.status(500).json(q);
		console.log(q.errors);
	} else {
		res.json(q);
	}
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
router.delete("/:model_code/delete", (req, res) => {
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
