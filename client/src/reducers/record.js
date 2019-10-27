import {
	SET_SELECTED_CUSTOMER,
	SET_SELECTED_BRANCH,
	SET_SELECTED_SUPPLIER,
	SET_SELECTED_MODEL,
	SET_SELECTED_STAFF,
	RESET_RECORD_DATA,
} from "@/common/action-types";

const initialState = {
	selectedCustomer: null,
	selectedBranch: null,
	selectedSupplier: null,
	selectedModel: null,
	selectedStaff: null
};

const record = (state = initialState, action) => {
	switch (action.type) {
		case SET_SELECTED_CUSTOMER:
			return {
				...state,
				selectedCustomer: action.payload.customer
			};
		case SET_SELECTED_BRANCH:
			return {
				...state,
				selectedBranch: action.payload.branch
			};
		case SET_SELECTED_SUPPLIER:
				return {
					...state,
					selectedBranch: action.payload.supplier
				};
		case SET_SELECTED_MODEL:
			return {
				...state,
				selectedBranch: action.payload.model
			};
		case SET_SELECTED_STAFF:
			return {
				...state,
				selectedBranch: action.payload.staff
			};
		case RESET_RECORD_DATA:
			return {
				selectedCustomer: null,
				selectedBranch: null,
				selectedSupplier: null,
				selectedModel: null,
				selectedStaff: null
			};
		default:
			return state;
	}
};

export default record;
