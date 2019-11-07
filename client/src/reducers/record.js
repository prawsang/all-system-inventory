import {
	SET_SELECTED_OBJECT,
	SET_STATIC_DATA,
	RESET_RECORD_DATA,
} from "@/common/action-types";

const initialState = {
	selectedCustomer: null,
	selectedBranch: null,
	selectedSupplier: null,
	selectedModel: null,
	selectedStaff: null,
	selectedDepartment: null,
	selectedProductType: null,
	selectedBulk: null,
	staticData: {
		departments: [],
		productTypes: [],
		staff: []
	}
};

const record = (state = initialState, action) => {
	switch (action.type) {
		case SET_SELECTED_OBJECT:
			return {
				...state,
				...action.payload
			};
		case SET_STATIC_DATA:
			return {
				...state,
				staticData: {
					...state.staticData,
					...action.payload
				}
			}
		case RESET_RECORD_DATA:
			return {
				selectedCustomer: null,
				selectedBranch: null,
				selectedSupplier: null,
				selectedModel: null,
				selectedStaff: null,
				selectedDepartment: null,
				selectedProductType: null,
				selectedBulk: null
			};
		default:
			return state;
	}
};

export default record;
