import {
	SET_SELECTED_CUSTOMER,
	SET_SELECTED_BRANCHES,
	FETCH_JOBS,
	RESET_RECORD_DATA
} from "@/common/action-types";
import Axios from "axios";

export const setSelectedCustomer = customer => async dispatch => {
	if (customer) {
		// Fetch branches
		await Axios.get(`/customer/${customer.customer_code}/branches`)
			.then(res => {
				// console.log(res);
				dispatch({
					payload: {
						branches: res.data.customer.branches
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

export const resetRecordData = () => {
	return {
		type: RESET_RECORD_DATA
	};
};
