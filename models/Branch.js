const Branch = {
	getColumns: `
		"branch"."branch_code",
		"branch"."name" AS "branch_name",
		"branch"."address"
	`
}


module.exports = Branch;
