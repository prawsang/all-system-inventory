import { SET_CURRENT_WITHDRAWAL, SET_ITEMS } from "@/common/action-types";

const initialState = {
	currentWithdrawal: null,
	items: {
		pos: [],
		scanners: [],
		monitors: [],
		keyboards: [],
		cashDrawers: [],
		printers: []
	}
};

const withdrawal = (state = initialState, action) => {
	switch (action.type) {
		case SET_CURRENT_WITHDRAWAL:
			return {
				...state,
				currentWithdrawal: action.payload.data
			};
		case SET_ITEMS:
			return {
				...state,
				items: action.payload.items
			};
		default:
			return state;
	}
};

export default withdrawal;
