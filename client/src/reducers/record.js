import {
	SET_SELECTED_OBJECT,
	RESET_RECORD_DATA,
} from "@/common/action-types";

const initialState = {
	selectedCustomer: null,
	selectedBranch: null,
	selectedSupplier: null,
	selectedModel: null,
	selectedStaff: null,
	selectedDepartment: null,
	selectedProductType: null
};

const record = (state = initialState, action) => {
	switch (action.type) {
		case SET_SELECTED_OBJECT:
			return {
				...state,
				...action.payload
			};
		case RESET_RECORD_DATA:
			return {
				selectedCustomer: null,
				selectedBranch: null,
				selectedSupplier: null,
				selectedModel: null,
				selectedStaff: null,
				selectedDepartment: null,
				selectedProductType: null
			};
		default:
			return state;
	}
};

export default record;
