const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.sendStatus(200));
router.use("/model", require("./model"));
router.use("/supplier", require("./supplier"));
router.use("/branch", require("./branch"));
router.use("/customer", require("./customer"));
router.use("/item", require("./item"));
router.use("/withdrawal", require("./withdrawal"));
router.use("/product-type", require("./product_type"));
router.use("/staff", require("./staff"));
router.use("/department", require("./department"));
router.use("/bulk", require("./bulk"));
router.use("/report", require("./report"));

module.exports = router;
