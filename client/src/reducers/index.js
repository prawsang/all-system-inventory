import { combineReducers } from "redux";
import report from "./report";
import record from "./record";
import withdrawal from "./withdrawal";
import error from "./error";

export default combineReducers({
	report,
	record,
	withdrawal,
	error
});
