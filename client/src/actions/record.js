import {
	SET_SELECTED_OBJECT,
	SET_STATIC_DATA,
	RESET_RECORD_DATA
} from "@/common/action-types";

export const setSelectedObject = data => {
	return {
		payload: data,
		type: SET_SELECTED_OBJECT
	}
};

export const setStaticData = data => {
	return {
		payload: data,
		type: SET_STATIC_DATA
	}
}

export const resetRecordData = () => {
	return {
		type: RESET_RECORD_DATA
	};
};
