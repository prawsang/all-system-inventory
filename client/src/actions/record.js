import {
	SET_SELECTED_CUSTOMER,
	SET_SELECTED_BRANCH,
	SET_SELECTED_SUPPLIER,
	SET_SELECTED_MODEL,
	SET_SELECTED_STAFF,
	RESET_RECORD_DATA,
} from "@/common/action-types";

export const setSelectedCustomer = customer => {
	return {
		payload: {
			customer
		},
		type: SET_SELECTED_CUSTOMER
	}
};

export const setSelectedBranch = branch => {
	return {
		payload: {
			branch
		},
		type: SET_SELECTED_BRANCH
	};
};

export const setSelectedSupplier = supplier => {
	return {
		payload: {
			supplier
		},
		type: SET_SELECTED_SUPPLIER
	};
};

export const setSelectedModel = model => {
	return {
		payload: {
			model
		},
		type: SET_SELECTED_MODEL
	};
};

export const setSelectedStaff = staff => {
	return {
		payload: {
			staff
		},
		type: SET_SELECTED_STAFF
	};
};

export const resetRecordData = () => {
	return {
		type: RESET_RECORD_DATA
	};
};
