const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.sendStatus(200));
router.use("/model", require("./model"));
router.use("/branch", require("./branch"));
router.use("/customer", require("./customer"));
router.use("/item", require("./item"));
router.use("/withdrawal", require("./withdrawal"));

// TODO: Import bulk, supplier, and product type routers

module.exports = router;
