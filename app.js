const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/database");

// Test DB
db.authenticate()
	.then(() => console.log("Database connected..."))
	.catch(err => console.log(err));

const app = express();

// Index route
app.get("/", (req, res) => res.sendStatus(200));

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", require("./routes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
