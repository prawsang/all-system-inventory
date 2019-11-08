const utils = require("../utils/");
const pool = require("../config/database");

let Item = {}

Item.getColumns = `"item"."serial_no",
    "item"."remarks",
    "item"."reserved_branch_code",
    "item"."status",
	"item"."is_broken",
	"item"."from_bulk_code"`;

// Class Methods
Item.buildWhere = serial_no => {
	let arr = [];
	let n = 1
	serial_no.forEach(no => {
		const t = `
			"item"."serial_no" = :serial_no_${n}
		`
		arr.push(t)
		n++;
	})
	return arr.join(" OR ");
}

// Change status of multiple items
// This will check if the items are of a valid status, and change those of valid statuses only.
Item.changeStatus = async params => {
	const { serial_no, validStatus, toStatus, otherInfo } = params;
	let updatedSerials = [];
	let errors = [];
	if (serial_no.length == 0)
		return { updatedSerials, errors: [{ msg: "Serial No. cannot be empty." }] };
	const validateStatus = await Item.checkStatus(serial_no, validStatus);
	errors = [...validateStatus.errors]

	await Promise.all(
		validateStatus.validSerials.map(async no => {
			const q = await utils.update({
				table: "item",
				info: {
					status: toStatus,
					...otherInfo
				},
				where: `"serial_no" = '${no}'`
			})
			if (q.errors) {
				errors.push({ msg: `Item ${no} cannot be updated.`})
			} else {
				updatedSerials.push(no)
			}
		})
	);
	return {
		updatedSerials,
		errors
	};
};

// Check if the items are of a status
Item.checkStatus = async (serial_no, status) => {
	if (typeof status == "string") status = [status];

	let replacements = [];
	let n = 1
	serial_no.forEach(no => {
		replacements[`serial_no_${n}`] = no;
		n++;
	})

	const q = await utils.raw({
		string: `
		SELECT "item"."serial_no", "item"."status", "item"."reserved_branch_code"
		FROM "item"
		WHERE ${Item.buildWhere(serial_no)}
		`,
		replacements
	});
	let errors = []
	let validSerials = []
	let validData = []

	q.rows.forEach(e => {
		if (status) {
			if (status.indexOf(e.status) >= 0) {
				validSerials.push(e.serial_no)
				validData.push(e)
			} else {
				errors.push({ msg: `Item ${e.serial_no} is not ${status[0]}`})
			}
		} else {
			validSerials.push(e.serial_no)
			validData.push(e)
		}
	})
	return {
		validSerials,
		validData,
		errors
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
	let statusFilter = status ? `"item"."status" = :status` : null;
	let typeFilter = type ? `"model"."is_product_type_name" = :type`: null

	return [brokenFilter, statusFilter, typeFilter].filter(e => e).join(" AND ");
};


module.exports = Item;
