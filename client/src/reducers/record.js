import {
	SET_SELECTED_CUSTOMER,
	SET_SELECTED_BRANCHES,
	SET_SELECTED_PO,
	SET_SELECTED_JOB_CODE,
	FETCH_JOBS
} from "@/common/action-types";
import { RESET_RECORD_DATA } from "../common/action-types";

const initialState = {
	selectedCustomer: null,
	selectedBranches: [],
	selectedPO: null,
	selectedJobCode: "",
	jobs: []
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
		case SET_SELECTED_PO:
			return {
				...state,
				selectedPO: action.payload.po
			};
		case SET_SELECTED_JOB_CODE:
			return {
				...state,
				selectedJobCode: action.payload.jobCode
			};
		case FETCH_JOBS:
			return {
				...state,
				jobs: action.payload.jobs
			};
		case RESET_RECORD_DATA:
			return {
				selectedCustomer: null,
				selectedBranches: [],
				selectedPO: null,
				selectedJobCode: "",
				jobs: []
			};
		default:
			return state;
	}
};

export default record;
