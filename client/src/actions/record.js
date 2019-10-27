import {
	SET_SELECTED_OBJECT,
	RESET_RECORD_DATA
} from "@/common/action-types";

export const setSelectedObject = data => {
	return {
		payload: data,
		type: SET_SELECTED_OBJECT
	}
};

export const resetRecordData = () => {
	return {
		type: RESET_RECORD_DATA
	};
};
