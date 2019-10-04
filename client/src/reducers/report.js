import {
	SET_PAGE,
	SET_LIMIT,
	SET_SEARCH_TERM,
	SET_SEARCH_COL,
	SET_FILTERS
} from "@/common/action-types";

const initialState = {
	data: {},
	currentPage: 1,
	currentLimit: 25,
	searchTerm: null,
	searchCol: null,
	filters: {
		from: null,
		to: null,
		installed: null,
		broken: null,
		status: null,
		type: null,
		install_from: null,
		install_to: null,
		return_from: null,
		return_to: null
	}
};

const report = (state = initialState, action) => {
	switch (action.type) {
		case SET_PAGE:
			return {
				...state,
				currentPage: action.payload.pageNumber
			};
		case SET_LIMIT:
			return {
				...state,
				currentLimit: action.payload.limit
			};
		case SET_SEARCH_TERM:
			return {
				...state,
				searchTerm: action.payload.searchTerm
			};
		case SET_SEARCH_COL:
			return {
				...state,
				searchCol: action.payload.searchCol
			};
		case SET_FILTERS:
			return {
				...state,
				filters: {
					...state.filters,
					...action.payload.filters
				}
			};
		default:
			return state;
	}
};

export default report;
