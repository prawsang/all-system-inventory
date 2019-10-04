import { SET_ERROR } from "@/common/action-types";

export const setError = error => {
	return {
		payload: {
			error
		},
		type: SET_ERROR
	};
};
