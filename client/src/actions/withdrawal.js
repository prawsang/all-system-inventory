import { SET_CURRENT_WITHDRAWAL, SET_ITEMS } from "@/common/action-types";

export const setCurrentWithdrawal = data => ({
	type: SET_CURRENT_WITHDRAWAL,
	payload: {
		data
	}
});

export const setItems = data => {
	const items = {
		pos: [],
		scanners: [],
		monitors: [],
		keyboards: [],
		cashDrawers: [],
		printers: [],
		maxCount: 0
	};
	data.forEach(e => {
		switch (e.model_type) {
			case "POS":
				items.pos.push(e.serial_no);
				if (items.pos.length > items.maxCount) items.maxCount = items.pos.length;
				break;
			case "SCANNER":
				items.scanners.push(e.serial_no);
				if (items.scanners.length > items.maxCount) items.maxCount = items.pos.length;
				break;
			case "MONITOR":
				items.monitors.push(e.serial_no);
				if (items.monitors.length > items.maxCount) items.maxCount = items.pos.length;
				break;
			case "KEYBOARD":
				items.keyboards.push(e.serial_no);
				if (items.keyboards.length > items.maxCount) items.maxCount = items.pos.length;
				break;
			case "CASH_DRAWER":
				items.cashDrawers.push(e.serial_no);
				if (items.cashDrawers.length > items.maxCount) items.maxCount = items.pos.length;
				break;
			case "PRINTER":
				items.printers.push(e.serial_no);
				if (items.printers.length > items.maxCount) items.maxCount = items.pos.length;
				break;
			default:
				break;
		}
	});
	return {
		type: SET_ITEMS,
		payload: {
			items
		}
	};
};
