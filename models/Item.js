const utils = require("../utils/query");

let Item = {}

Item.getColumns = `"item"."serial_no",
    "item"."remarks",
    "item"."reserved_branch_code",
    "item"."status",
	"item"."is_broken",
	"item"."from_bulk_code"`;

// Class Methods

// Change status of multiple items
// This will check if the items are of a valid status, and change those of valid statuses only.
Item.changeStatus = async params => {
	const { serial_no, validStatus, toStatus, otherInfo } = params;
	let updatedSerials = [];
	let errors = [];
	if (serial_no.length == 0)
		return { updatedSerials, errors: [{ msg: "Serial No. cannot be empty." }] };

	await Promise.all(
		serial_no.map(async no => {
			let valid = true;
			if (validStatus) {
				valid = await Item.checkStatus(no, validStatus);
			}
			if (valid) {
				const q = await utils.update({
					table: "item",
					info: {
						status: toStatus,
						...otherInfo
					},
					where: `"serial_no" = '${no}'`
				})
				if (q.errors) {
					errors.push(err)
				} else {
					updatedSerials.push(no)
				}
			} else {
				errors.push({ msg: `The ${no} item is not ${validStatus[0]}` });
			}
		})
	);
	return {
		updatedSerials,
		errors
	};
};

// Check if the item's (single item) is of a status
Item.checkStatus = (serial_no, status) => {
	if (typeof status == "string") status = [status];

	const q = utils.findOne({
		tables: "item",
		cols: Item.getColumns,
		where: `"serial_no" = '${serial_no}'`
	})
	if (q.errors) {
		return false
	} else {
		if (q.data) {
			if (status.indexOf(q.data.status) >= 0) return true;
		}
		return false
	}
};

// Filtering
Item.filter = data => {
	const { is_broken, status, type } = data;
	let brokenFilter = is_broken
		? is_broken === "true"
			? `"item"."is_broken"`
			: `NOT "item"."is_broken"`
		: null;
	let statusFilter = status ? `"item"."status" = ${status}` : null;
	let typeFilter = type ? `"model"."is_product_type_name" = ${type}` : null;

	// FINISHED: Add filtering for an item's type

	return [brokenFilter, statusFilter, typeFilter].filter(e => e).join(" AND ");
};


module.exports = Item;
