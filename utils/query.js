const pool = require("../config/database");

const checkColName = (name, cols) => {
	if (cols.indexOf(name) >= 0) {
		return true;
	}
	return false;
};

const getFromAlias = col => {
	switch (col) {
		case "customer_name":
			return `"customer"."name"`;
		case "branch_name":
			return `"branch"."name"`;
		case "model_code":
			return `"model"."model_code"`;
		case "model_name":
			return `"model"."name"`;
		case "withdrawal_type":
			return `"withdrawal"."type"`;
		case "withdrawal_date":
			return `"withdrawal"."date"`;
		case "withdrawal_status":
			return `"withdrawal"."status"`;
		case "serial_no":
			return `"item"."serial_no"`;
		case "product_type_name":
			return `"product_type"."type_name"`;
		case "supplier_name":
			return `"supplier"."name"`;
		case "staff_name":
			return `"staff"."name"`;
		case "department_name":
			return `"department"."name"`;
		default:
			return `"${col}"`;
	}
};

const correctValueString = (value, rep) => {
	switch (typeof value) {
		case "number":
			return value
		case "string":
			return `'${value}'`;
		case "boolean":
			return value ? "true" : "false";
		default:
			return null;
	}
}

const buildString = (data) => {
	const { limit, page, cols, tables, availableCols, where, groupBy } = data;
	let { search_col, search_term } = data;
	if (search_term) {
		search_term = search_term.toLowerCase();
	}

	if (search_col && !checkColName(search_col, availableCols) && search_term) {
		search_col = null;
		search_term = null;
	}
	if (search_col) {
		search_col = getFromAlias(search_col);
	}

	let whereString = "";
	if (where || (search_col && search_term)) {
		const search =
			search_col && search_term ? `LOWER(${search_col}) LIKE LOWER(${search_term ? `'%${search_term}%'` : ""})` : null;
		whereString = `WHERE ${[where, search].filter(e => e).join(" AND ")}`;
	}

	let countString = `SELECT COUNT(*) 
	FROM ${tables} 
	${whereString}
	${groupBy ? groupBy : ""}
	`
	let queryString = `SELECT ${cols}
	FROM ${tables}
	${whereString}
	${groupBy ? groupBy : ""}
	${limit ? `LIMIT ${limit}` : ""}
	${limit && page ? `OFFSET ${limit * (page - 1)}` : ""}`

	return {
		countString,
		queryString
	}
}

module.exports = {
	query: async function(data) {
		const { limit, page, cols, tables, availableCols, where, groupBy, search_col, search_term } = data;
		
		let count = 0;
		let response = [];
		let errors = [];

		const {
			countString,
			queryString
		} = buildString({
			limit, 
			page, 
			cols, 
			tables, 
			availableCols, 
			where, 
			groupBy, 
			search_col, 
			search_term
		})
		console.log(countString);
		console.log(queryString);
		await pool
			.query(countString)
			.then(c => {
				count = c.rows[0].count;
			})
			.catch(err => {
				errors.push(err);
			});

		await pool
			.query(queryString)
			.then(r => {
				response = r.rows;
			})
			.catch(err => {
				errors.push(err);
			});
		if (errors.length > 0) {
			return {
				errors
			};
		}
		return {
			rows: response,
			count,
			pagesCount: limit ? Math.ceil(count / limit) : 1
		};
	},
	findOne: async function(data) {
		const { tables, cols, where } = data;
		let string = `
		SELECT ${cols}
		FROM ${tables}
		WHERE ${where}
		`;
		let errors = [];
		let response = [];
		
		console.log(string);

		await pool
			.query(string)
			.then(r => {
				response = r.rows;
			})
			.catch(err => {
				errors.push(err);
			});
		if (errors.length > 0) {
			return {
				errors
			};
		}
		return response[0] ? { data: response[0]} : {
			data: null
		};
	},
	insert: async function(data) {
		const { table, info, returning } = data;
		let cols = [];
		let values = []
		Object.keys(info).forEach(key => {
			cols.push(`"${key}"`);
			const valueS = correctValueString(info[key]);
			values.push(valueS ? valueS : "null");
		});
		const colString = `(${cols.join(", ")})`
		const valueString = `(${values.join(", ")})`

		let string = `
		INSERT INTO ${table} ${colString}
		VALUES ${valueString}
		${returning ? `RETURNING ${returning}` : ""}
		`

		console.log(string);

		let errors = [];
		let response = [];

		await pool
			.query(string)
			.then(r => {
				response = r.rows;
			})
			.catch(err => {
				errors.push(err);
			});
		if (errors.length > 0) {
			return {
				errors
			};
		}
		return {
			rows: response,
		};
	},
	update: async function(data) {
		const { table, info, from, where, returning } = data;

		let setArray = []
		Object.keys(info).forEach(key => {
			let value = info[key];
			const valueS = correctValueString(value);
			setArray.push(`"${key}" = ${valueS ? valueS : "null"}`);
		})
		const setString = setArray.join(", ")

		let string = `
		UPDATE ${table}
		SET ${setString}
		${from ? `FROM ${from}` : ""}
		WHERE ${where}
		${returning ? `RETURNING ${returning}` : ""}
		` 

		console.log(string);

		let errors = [];
		let response = [];

		await pool
			.query(string)
			.then(r => {
				response = r.rows;
			})
			.catch(err => {
				errors.push(err);
			});
		if (errors.length > 0) {
			return {
				errors
			};
		}
		return {
			rows: response,
		};
	},
	del: async function(data) {
		const { table, using, from, where } = data;
		let string = `
		DELETE FROM ${table}
		${using ? `USING ${using}` : ""}
		WHERE ${where}
		`

		console.log(string);

		let errors = [];
		let response = [];

		await pool
			.query(string)
			.then(r => {
				response = r.rows;
			})
			.catch(err => {
				errors.push(err);
			});
		if (errors.length > 0) {
			return {
				errors
			};
		}
		return {
			rows: response,
		};
	}
};
