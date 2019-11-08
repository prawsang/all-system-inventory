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

const replaceValues = (string, replacements) => {
	let n = 1;
	let values = [];
	console.log(replacements);
	Object.keys(replacements).forEach(key => {
		if (replacements[key] !== null && replacements[key] !== "" && replacements[key] !== undefined) {
			string = string.replace(new RegExp(`:${key}`, 'g'), `$${n}`)
			values.push(replacements[key]);
			n++;
		}
	})
	return {
		string,
		values
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
			search_col && search_term ? `LOWER(${search_col}) LIKE LOWER(${search_term ? `:search_term` : ""})` : null;
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
	${limit ? `LIMIT :limit` : ""}
	${limit && page ? `OFFSET :offset` : ""}`

	console.log(queryString);

	return {
		countString,
		queryString,
	}
}

module.exports = {
	query: async function(data) {
		const { limit, 
			page, 
			cols, 
			tables, 
			availableCols, 
			where, 
			groupBy, 
			search_col, 
			search_term, 
			replacements 
		} = data;
		let count = 0;
		let response = [];
		let errors = [];

		const {
			countString,
			queryString,
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

		const rCount = replaceValues(countString,{
			search_term: search_term ? `%${search_term}%` : "",
			...replacements
		});
		const rQuery = replaceValues(queryString,{
			search_term: search_term ? `%${search_term}%` : "",
			limit,
			offset: limit ? limit * (page - 1) : null,
			...replacements
		});

		console.log(rCount.string);
		console.log(rQuery.string);

		await pool
			.query(rCount.string, rCount.values)
			.then(c => {
				count = c.rows[0].count;
			})
			.catch(err => {
				errors.push(err);
				console.log(err)
			});

		await pool
			.query(rQuery.string, rQuery.values)
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
		const { tables, cols, where, replacements } = data;
		let string = `
		SELECT ${cols}
		FROM ${tables}
		WHERE ${where}
		`;
		let errors = [];
		let response = [];
		
		const rString = replaceValues(string, replacements);
		console.log(rString.string);

		await pool
			.query(rString.string, rString.values)
			.then(r => {
				response = r.rows;
			})
			.catch(err => {
				errors.push(err);
				console.log(err)
			});
		if (errors.length > 0) {
			return {
				errors
			};
		}
		return response[0] ? { row: response[0]} : {
			row: null
		};
	},
	raw: async function(data) {
		const { string, replacements } = data;
		const rString = replaceValues(string, replacements);
		let response = null;
		let errors = [];

		console.log(rString.string);

		await pool
			.query(rString.string, rString.values)
			.then(r => {
				response = r.rows;
			})
			.catch(err => {
				errors.push(err);
				console.log(errors);
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
	insert: async function(data) {
		const { table, info, returning } = data;
		let cols = [];
		let params = []
		Object.keys(info).forEach(key => {
			cols.push(`"${key}"`);
			params.push(`:${key}`)
		});
		const colString = `(${cols.join(", ")})`
		const paramString = `(${params.join(", ")})`

		let string = `
		INSERT INTO ${table} ${colString}
		VALUES ${paramString}
		${returning ? `RETURNING ${returning}` : ""}
		`

		const rString = replaceValues(string, info);

		console.log(rString.string);

		let errors = [];
		let response = [];

		await pool
			.query(rString.string, rString.values)
			.then(r => {
				response = r.rows;
			})
			.catch(err => {
				errors.push(err);
				console.log(err)
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
		const { table, info, from, where, returning, replacements } = data;

		let setArray = []
		Object.keys(info).forEach(key => {
			setArray.push(`"${key}" = :${key}`);
		})
		const setString = setArray.join(", ")

		let string = `
		UPDATE ${table}
		SET ${setString}
		${from ? `FROM ${from}` : ""}
		WHERE ${where}
		${returning ? `RETURNING ${returning}` : ""}
		` 
		const rString = replaceValues(string, {
			...info,
			...replacements
		})
		console.log(rString.string);

		let errors = [];
		let response = [];

		await pool
			.query(rString.string, rString.values)
			.then(r => {
				response = r.rows;
			})
			.catch(err => {
				errors.push(err);
				console.log(err)
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
		const { table, using, where, replacements } = data;
		let string = `
		DELETE FROM ${table}
		${using ? `USING ${using}` : ""}
		WHERE ${where}
		`

		const rString = replaceValues(string, replacements)

		console.log(rString.string);

		let errors = [];
		let response = [];

		await pool
			.query(rString.string, rString.values)
			.then(r => {
				response = r.rows;
			})
			.catch(err => {
				errors.push(err);
				console.log(err)
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
