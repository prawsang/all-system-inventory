const Staff = {};

Staff.getColumns = `
	"staff"."staff_code",
	"staff"."name" AS "staff_name",
	"staff"."works_for_dep_code" AS "staff_department"
`;

module.exports = Staff;
