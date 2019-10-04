import {
	SET_SELECTED_CUSTOMER,
	SET_SELECTED_BRANCHES,
	SET_SELECTED_PO,
	SET_SELECTED_JOB_CODE,
	FETCH_JOBS,
	RESET_RECORD_DATA
} from "@/common/action-types";
import Axios from "axios";

export const setSelectedCustomer = customer => async dispatch => {
	if (customer) {
		// Fetch jobs
		await Axios.get(`/customer/${customer.customer_code}/details`)
			.then(res => {
				console.log(res);
				dispatch({
					payload: {
						jobs: res.data.customer.jobs
					},
					type: FETCH_JOBS
				});
			})
			.catch(err => {
				dispatch({
					payload: {
						jobs: []
					},
					type: FETCH_JOBS
				});
			});
	} else {
		dispatch({
			payload: {
				jobs: []
			},
			type: FETCH_JOBS
		});
	}
	dispatch({
		payload: {
			customer
		},
		type: SET_SELECTED_CUSTOMER
	});
};

export const setSelectedBranches = branches => {
	return {
		payload: {
			branches
		},
		type: SET_SELECTED_BRANCHES
	};
};

export const setSelectedPO = po => ({
	payload: {
		po
	},
	type: SET_SELECTED_PO
});

export const setSelectedJobCode = jobCode => {
	return {
		payload: {
			jobCode
		},
		type: SET_SELECTED_JOB_CODE
	};
};

export const resetRecordData = () => {
	return {
		type: RESET_RECORD_DATA
	};
};
