import { SET_ERROR } from "@/common/action-types";

const initialState = {
	error: null
};

const error = (state = initialState, action) => {
	switch (action.type) {
		case SET_ERROR:
			return {
				...state,
				error: action.payload.error
			};
		default:
			return state;
	}
};

export default error;
