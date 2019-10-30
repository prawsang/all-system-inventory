const express = require("express");
const router = express.Router();
const models = require("../../models/");
const ProductType = models.ProductType;
const { query } = require("../../utils/query");
const { check, validationResult } = require("express-validator/check");

router.get("/get-all", async (req, res) => {
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_term,
		search_col,
		cols: ProductType.getColumns,
		tables: "product_type",
		availableCols: ["product_type_name"]
	});
	if (q.errors) {
        console.log(q.errors);
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

const productTypeValidation = [
	check("type_name")
		.not()
		.isEmpty()
		.withMessage("Type Name must be provided."),
];

// Add New ProductType
router.post("/add", productTypeValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const {
		type_name
	} = req.body;
	ProductType.create({
		type_name
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Edit ProductType
router.put("/:type_name/edit", productTypeValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const {
		type_name,
	} = req.body;
	ProductType.update({
		type_name,
	},{
		where: {
			type_name: {
				[Op.eq]: type_name
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Delete ProductType
router.delete("/:type_name/delete", (req, res) => {
	const { type_name } = req.params;
	ProductType.destroy({
		where: {
			type_name: {
				[Op.eq]: type_name
			}
		}
	}).then(rows => res.sendStatus(200))
	.catch(err => res.status(500).json({ errors: err }));
})

module.exports = router;