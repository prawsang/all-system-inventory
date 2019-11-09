const express = require("express");
const router = express.Router();
const models = require("../../models/");
const { check, validationResult } = require("express-validator/check");
const utils = require("../../utils/");
const pool = require("../../config/database");

router.get("/get-all", async (req, res) => {
	const { limit, page, search_col, search_term, from, to } = req.query;

	let dateFilter = null;

	if (from || to) {
		const f = from ? `"bulk"."date_in" >= '${from}'` : null;
		const t = to ? `"bulk"."date_in" <= '${to}'` : null;
		dateFilter = [f, t].filter(e => e).join(" AND ");
	}

	const q = await utils.query({
		limit,
		page,
		search_term,
		search_col,
		cols: `${models.Bulk.getColumns}, ${models.Model.getColumns}, ${models.Supplier.getColumns}`,
        tables: `"bulk"
		JOIN "model" ON "bulk"."of_model_code" = "model"."model_code"
		JOIN "supplier" ON "model"."from_supplier_code" = "supplier"."supplier_code"`,
		where: dateFilter,
		availableCols: ["bulk_code","model_name","model_code","supplier_name","bulk_code"]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

router.get("/:bulk_code/details", async (req, res) => {
	const { bulk_code } = req.params;
	const q = await utils.findOne({
		cols: models.Bulk.getColumns,
		tables: "bulk",
		where: `"bulk_code" = '${bulk_code}'`,
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

router.get("/:bulk_code/items", async (req, res) => {
	const { bulk_code } = req.params;
	const { limit, page, search_col, search_term } = req.query;

	const q = await utils.query({
		limit,
		page,
		search_term,
		search_col,
		cols: `${models.Item.getColumns}`,
		tables: `"item"`,
		where: `"item"."from_bulk_code" = '${bulk_code}'`,
		availableCols: ["serial_no"],
	});
	if (q.errors) {
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
	check("is_broken")
		.isBoolean()
		.withMessage("Must specify whether the item is broken or not")
]

// Add a bulk along with items
addBulkAndItems = async (body) => {
	const { 
		bulk_code,
		of_model_code,
		price_per_unit,
		date_in, 
		serial_no,
		remarks
	} = body;

	// Add bulk
	const bulk = await utils.insert({
		table: "bulk",
		info: {
			bulk_code,
			of_model_code,
			price_per_unit,
			date_in
		},
		returning: "bulk_code"
	})
	if (bulk.errors) {
		return bulk.errors
	}

	let errors = [];
	// Add items
	await Promise.all(
		serial_no.map(async no => {
			const item = await utils.insert({
				table: "item",
				info: {
					serial_no: no,
					from_bulk_code: bulk_code,
					remarks,
					status: "IN_STOCK",
					is_broken: false
				},
			})
			if (item.errors) {
				errors.push({
					msg: `Item serial no. ${no} is already in the stock.`
				})
			}
		})
	);
	return errors;
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
	if (errors.length > 0) res.status(400).json({ errors });
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
			const q = await utils.insert({
				table: "item",
				info: {
					serial_no: no,
					from_bulk_code: bulk_code,
					remarks,
					status: "IN_STOCK",
					is_broken: false
				}
			})
			if (q.errors) {
				errors.push(err)
			}
		})
	);
	if (errors.length > 0) {
		res.status(400).json(errors);
	} else {
		res.sendStatus(200);
	}
});

// Edit 
router.put("/:bulk_code/edit", bulkValidation, async (req,res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { of_model_code, price_per_unit, date_in } = req.body;
	const { bulk_code } = req.params;
	
	const q = await utils.update({
		table: "bulk",
		info: {
			bulk_code, 
			of_model_code,
			price_per_unit,
			date_in
		},
		where: `"bulk_code" = '${bulk_code}'`,
		returning: "bulk_code"
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
})

// Delete
router.delete("/:bulk_code/delete", async (req,res) => {
	const { bulk_code } = req.params;
	
	const q = await utils.del({
		table: "bulk",
		where: `"bulk_code" = '${bulk_code}'`,
	});
	if (q.errors) {
		res.status(400).json({ errors:
			[{ msg: "Some items in this bulk has been withdrawn or reserved and cannot be deleted"}]
		});
	} else {
		res.json(q);
	}
})

module.exports = router;