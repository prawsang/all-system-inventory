const express = require("express");
const router = express.Router();
const models = require("../../models/");
const {
	Item,
	Bulk,
	Model,
	Supplier
} = models
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../../config/database");
const { check, validationResult } = require("express-validator/check");
const { query } = require("../../utils/query");

router.get("/get-all", async (req, res) => {
	const { limit, page, search_col, search_term, from, to } = req.query;

	let dateFilter = null;

	if (from || to) {
		const f = from ? `"bulk"."date_in" >= :from` : null;
		const t = to ? `"bulk"."date_in" <= :to` : null;
		dateFilter = [f, t].filter(e => e).join(" AND ");
	}

	const q = await query({
		limit,
		page,
		search_term,
		search_col,
		cols: `${Bulk.getColumns}, ${Model.getColumns}, ${Supplier.getColumns}`,
        tables: `"bulk"
		JOIN "model" ON "bulk"."of_model_code" = "model"."model_code"
		JOIN "supplier" ON "model"."from_supplier_code" = "supplier"."supplier_code"`,
		where: dateFilter,
		replacements: {
			from,
			to
		},
		availableCols: ["bulk_code","model_name","model_code","supplier_name","supplier_code"]
	});
	if (q.errors) {
        console.log(q.errors);
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

router.get("/:bulk_code/details", (req,res) => {
	const { bulk_code } = req.params;

	Bulk.findOne({
		where: {
			bulk_code: {
				[Op.eq]: bulk_code
			}
		},
		include: [{
			model: Model,
			as: "model",
			include: {
				model: Supplier,
				as: "supplier"
			}
		}]
	})
	.then(bulk => res.send({ bulk }))
	.catch(err => res.status(500).json({ errors: err }));
});

router.get("/:bulk_code/items", async (req, res) => {
	const { bulk_code } = req.params;
	const { limit, page, search_col, search_term, is_broken, status } = req.query;

	const filters = Item.filter({
		is_broken,
		status,
	});

	const q = await query({
		limit,
		page,
		search_term,
		search_col,
		cols: `${Item.getColumns}`,
        tables: `"item"`,
		where: `"item"."from_bulk_code" = :bulk_code ${filters ? `AND ${filters}` : ""}`,
		replacements: {
			bulk_code
		},
		availableCols: ["serial_no"]
	});
	if (q.errors) {
        console.log(q.errors);
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Validation
const bulkValidation = [
    check("bulk_code")
		.not()
		.isEmpty()
		.withMessage("Bulk code must be provided."),
	check("of_model_code")
		.not()
		.isEmpty()
		.withMessage("Model must be provided."),
	check("price_per_unit")
		.not()
		.isEmpty()
        .withMessage("Price per unit must be provided."),
    check("date_in")
		.not()
		.isEmpty()
		.withMessage("Date in must be provided."),
];
const itemValidation = [
    check("serial_no")
        .isArray()
        .not()
        .isEmpty()
		.withMessage("Serial No. of items must be provided."),
]

// Add a bulk along with items
addBulkAndItems = (body) => {
	const { 
		bulk_code,
		of_model_code,
		price_per_unit,
		date_in, 
		serial_no,
		remarks
	} = body;
	return db.transaction(t => 
		Bulk.create({
			bulk_code,
			of_model_code,
			price_per_unit,
			date_in
		},{
			transaction: t
		}).then(async r => {
			// console.log(r);
			serial_no.map(no => {
				Item.create({
					serial_no: no,
					remarks,
					status: "IN_STOCK",
					is_broken: false,
					from_bulk_code: bulk_code
				},{
					transaction: t
				})
			})
		})
	).then(r => ({
		errors: []
	}))
	.catch(err => ({ errors: [{msg: "Bulk cannot be added. Please check information and serial numbers."}]}));
}

router.post("/add", [...bulkValidation, ...itemValidation], async (req, res) => {
    const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
    }
    
	const { 
		bulk_code,
		of_model_code,
		price_per_unit,
		date_in, 
		serial_no,
		remarks 
	} = req.body;

	const errors = await addBulkAndItems({
		bulk_code,
		of_model_code,
		price_per_unit,
		date_in, 
		serial_no,
		remarks 
	})
	if (errors.length > 0) res.status(500).json({ errors });
	else res.sendStatus(200);
});

// Add Items to Bulk
router.post("/:bulk_code/add-items", itemValidation, async (req,res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	
	const { serial_no, remarks } = req.body;
	const { bulk_code } = req.params;
	let errors = []

	await Promise.all(
		serial_no.map(async no => {
			await Item.create({
				serial_no: no,
				from_bulk_code: bulk_code,
				remarks,
				status: "IN_STOCK",
				is_broken: false,
			}).catch(err => errors.push(err));
		})
	);
	if (errors.length > 0) {
		res.status(400).json(errors);
	} else {
		res.sendStatus(200);
	}
});

// Edit Bulk
router.put("/:bulk_code/edit", bulkValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { bulk_code } = req.params;
	const { 
		of_model_code,
		price_per_unit,
		date_in,
	 } = req.body;
	Bulk.update(
		{
			of_model_code,
			price_per_unit,
			date_in,
		},
		{
			where: {
				bulk_code: {
					[Op.eq]: bulk_code
				}
			}
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Delete bulk
router.delete("/:bulk_code/delete", (req, res) => {
	const { bulk_code } = req.params;
	Bulk.destroy({
		where: {
			bulk_code: {
				[Op.eq]: bulk_code
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err =>
			res
				.status(500)
				.send({ errors: [{ msg: "This bulk cannot be deleted.", errors: err }] })
		);
});

module.exports = router;