import {
	SET_SELECTED_CUSTOMER,
	SET_SELECTED_BRANCHES,
} from "@/common/action-types";
import { RESET_RECORD_DATA } from "../common/action-types";

const initialState = {
	selectedCustomer: null,
	selectedBranches: [],
};

const record = (state = initialState, action) => {
	switch (action.type) {
		case SET_SELECTED_CUSTOMER:
			return {
				...state,
				selectedCustomer: action.payload.customer
			};
		case SET_SELECTED_BRANCHES:
			return {
				...state,
				selectedBranches: action.payload.branches
			};
		case RESET_RECORD_DATA:
			return {
				selectedCustomer: null,
				selectedBranches: [],
			};
		default:
			return state;
	}
};

export default record;
