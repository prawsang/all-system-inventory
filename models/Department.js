const Department = {
    getColumns: `"department"."department_code",
    "department"."name" AS "department_name",
    "department"."phone" AS "department_phone"`
}

module.exports = Department;