const db = require("../config/database");

const checkColName = (name, cols) => {
	if (cols.indexOf(name) >= 0) {
		return true;
	}
	return false;
};

const getFromAlias = col => {
	switch (col) {
		case "customer_name":
			return `"customers"."name"`;
		case "customer_code":
			return `"customers"."customer_code"`;
		case "job_name":
			return `"jobs"."name"`;
		case "branch_id":
			return `"branches"."id"`;
		case "branch_name":
			return `"branches"."name"`;
		case "po_date":
			return `"purchase_orders"."date"`;
		case "store_type_name":
			return `"store_types"."name"`;
		case "model_id":
			return `"models"."id"`;
		case "model_name":
			return `"models"."name"`;
		case "model_type":
			return `"models"."type"`;
		case "withdrawal_type":
			return `"withdrawals"."type"`;
		case "withdrawal_date":
			return `"withdrawals"."date"`;
		case "withdrawal_status":
			return `"withdrawals"."status"`;
		case "store_type_name":
			return `"store_types"."name"`;
		case "serial_no":
			return `"stock"."serial_no"`;
		case "po_number":
			return `"purchase_orders"."po_number"`;
		default:
			return `"${col}"`;
	}
};

module.exports = {
	query: async function(data) {
		const { limit, page, cols, tables, availableCols, where, groupBy, replacements } = data;
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
		let count = 0;
		let response = [];
		let errors = [];

		let whereString = "";
		if (where || (search_col && search_term)) {
			const search =
				search_col && search_term ? `LOWER(${search_col}) LIKE LOWER(:search_term)` : null;
			whereString = `WHERE ${[where, search].filter(e => e).join(" AND ")}`;
		}
		await db
			.query(
				`SELECT COUNT(*) 
            FROM ${tables} 
			${whereString}
			${groupBy ? groupBy : ""}
            `,
				{
					replacements: {
						search_term: search_term ? `%${search_term}%` : "",
						...replacements
					},
					type: db.QueryTypes.SELECT
				}
			)
			.then(c => {
				count = c[0].count;
			})
			.catch(err => {
				errors.push(err);
			});

		await db
			.query(
				`SELECT ${cols}
            FROM ${tables}
			${whereString}
			${groupBy ? groupBy : ""}
            ${limit ? `LIMIT :limit` : ""}
            ${limit && page ? `OFFSET :offset` : ""}`,
				{
					replacements: {
						search_term: search_term ? `%${search_term}%` : "",
						limit,
						offset: limit * (page - 1),
						...replacements
					},
					type: db.QueryTypes.SELECT
				}
			)
			.then(r => {
				response = r;
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
	}
};
