const express = require("express");
const router = express.Router();
const utils = require("../../utils/");
const models = require("../../models/")

// Generate Cost Report
router.get("/cost-report", async (req, res) => {
    const { from, to } = req.query;
    if (from && to) {
        const inc = await utils.raw({
            string: `SELECT SUM(price_per_unit)
            FROM bulk
            JOIN item ON bulk.bulk_code = item.from_bulk_code
            WHERE bulk.date_in BETWEEN :from AND :to`,
            replacements: {from, to}
        });
        const outc = await utils.raw({
            string: `SELECT SUM(selling_price_per_unit + add_costs)
            FROM bulk
            JOIN item ON bulk.bulk_code = item.from_bulk_code
            JOIN withdrawal_has_item ON item.serial_no = withdrawal_has_item.serial_no
            JOIN withdrawal ON withdrawal_has_item.withdrawal_id = withdrawal.id
            WHERE withdrawal.date BETWEEN :from AND :to
            AND withdrawal.status = 'CONFIRMED'
            AND withdrawal.type = 'INSTALLATION'`,
            replacements: { from, to }
        });
        if (!inc.errors && !outc.errors) {
            res.status(200).json({
                row: {
                    in_cost: inc.rows[0].sum,
                    out_cost: outc.rows[0].sum,
                }
            })
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
});

router.get("/top-customers", async (req, res) => {
    const { from, to } = req.query;
    if (from && to) {
        const q = await utils.raw({
            string: `SELECT ${models.Customer.getColumns}, SUM(selling_price_per_unit + add_costs)
            FROM bulk
            JOIN item ON bulk.bulk_code = item.from_bulk_code
            JOIN withdrawal_has_item ON item.serial_no = withdrawal_has_item.serial_no
            JOIN withdrawal ON withdrawal_has_item.withdrawal_id = withdrawal.id
            JOIN branch ON withdrawal.for_branch_code = branch.branch_code
            JOIN customer ON branch.owner_customer_code = customer.customer_code
            WHERE withdrawal.date BETWEEN :from AND :to
            AND withdrawal.status = 'CONFIRMED'
            AND withdrawal.type = 'INSTALLATION'
            GROUP BY customer.customer_code
            LIMIT 10`,
            replacements: {from, to}
        });
        if (!q.errors) {
            res.status(200).json(q)
        } else {
            res.status(500).json(q.errors);
        }
    } else {
        res.sendStatus(400);
    }
});


module.exports = router;