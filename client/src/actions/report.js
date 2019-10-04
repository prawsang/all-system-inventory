import {
	SET_PAGE,
	SET_LIMIT,
	SET_SEARCH_TERM,
	SET_SEARCH_COL,
	SET_FILTERS
} from "@/common/action-types";

export const setPage = pageNumber => ({
	payload: {
		pageNumber: parseInt(pageNumber)
	},
	type: SET_PAGE
});

export const setLimit = limit => ({
	payload: {
		limit: parseInt(limit)
	},
	type: SET_LIMIT
});

export const setSearchTerm = searchTerm => ({
	payload: {
		searchTerm
	},
	type: SET_SEARCH_TERM
});

export const setSearchCol = searchCol => ({
	payload: {
		searchCol
	},
	type: SET_SEARCH_COL
});

export const setFilters = filters => ({
	payload: {
		filters
	},
	type: SET_FILTERS
});
