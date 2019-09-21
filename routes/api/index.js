const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.sendStatus(200));
router.use("/model", require("./model"));
router.use("/user", require("./user"));
router.use("/branch", require("./branch"));
router.use("/job", require("./job"));
router.use("/customer", require("./customer"));
router.use("/stock", require("./stock"));
router.use("/withdrawal", require("./withdrawal"));
router.use("/po", require("./purchase_order"));
router.use("/store-type", require("./store_type"));

// TODO: Import bulk, supplier, and product type routers

module.exports = router;
