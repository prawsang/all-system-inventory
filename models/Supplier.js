const Supplier = {};

Supplier.getColumns = `
	"supplier"."supplier_code",
	"supplier"."name" AS "supplier_name",
	"supplier"."phone" AS "supplier_phone",
	"supplier"."email" AS "supplier_email"
`;

module.exports = Supplier;
