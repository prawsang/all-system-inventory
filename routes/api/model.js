const express = require("express");
const router = express.Router();
const Model = require("../../models/Model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { query } = require("../../utils/query");
const { check, validationResult } = require("express-validator/check");

router.route("/get-all").get(async (req, res) => {
	const { limit, page, search_col, search_term, type } = req.query;
	// TODO: Join with supplier and product type tables
	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: Model.getColumns,
		tables: `"model"`,
		availableCols: ["model_code", "model_name"],
		replacements: {
			type
		}
	});
	if (q.errors) {
		res.status(500).json(q);
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

// TODO: Connect with supplier and product type tables
const modelValidation = [
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

	// TODO: Connect with supplier and product type tables
	const { name } = req.body;
	Model.create({
		name
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

	// TODO: Connect with supplier and product type tables
	const { model_code } = req.params;
	const { name } = req.body;
	Model.update(
		{
			name
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
