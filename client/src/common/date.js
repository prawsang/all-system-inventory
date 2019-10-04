import moment from "moment";

export const formatDate = date => {
	if (!date || date === "") return "-";
	return moment(date).format("D/M/YYYY");
};

export const dashedDate = date => {
	if (!date || date === "") return null;
	return moment(date).format("YYYY-MM-DD");
};
