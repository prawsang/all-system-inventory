/* eslint-disable eqeqeq */
import React from "react";
import Axios from "axios";
import { setSearchCol, setSearchTerm, setFilters } from "@/actions/report";
import { connect } from "react-redux";

class FetchDataFromServer extends React.Component {
	state = {
		data: null
	};

	makeFilterString() {
		const { filters } = this.props;
		let string = [];
		// Date Filters
		if (filters.to) {
			string.push(`to=${filters.to}`);
		}
		if (filters.from) {
			string.push(`from=${filters.from}`);
		}
		if (filters.install_to) {
			string.push(`install_to=${filters.install_to}`);
		}
		if (filters.install_from) {
			string.push(`install_from=${filters.install_from}`);
		}
		if (filters.return_to) {
			string.push(`return_to=${filters.return_to}`);
		}
		if (filters.return_from) {
			string.push(`return_from=${filters.return_from}`);
		}

		// Type enforcement
		if (filters.install_to || filters.install_from) {
			string.push(`"withdrawals"."type" = 'INSTALLATION'`);
		}
		if (filters.return_to || filters.return_from) {
			string.push(`"withdrawals"."type" = 'BORROW'`);
		}

		// Boolean Filters
		if (filters.broken !== null) {
			string.push(filters.broken ? "broken=true" : "broken=false");
		}
		if (filters.installed !== null) {
			string.push(filters.installed ? "installed=true" : "installed=false");
		}

		// Text Filters
		if (filters.type !== null) {
			string.push(`type=${filters.type}`);
		}
		if (filters.status !== null) {
			string.push(`status=${filters.status}`);
		}

		if (string.length > 0) {
			return string.join("&");
		}
		return null;
	}

	compareFilters(prev, curr) {
		const {
			from,
			to,
			installed,
			broken,
			status,
			type,
			install_from,
			install_to,
			return_from,
			return_to
		} = curr;
		const {
			from_prev,
			to_prev,
			installed_prev,
			broken_prev,
			status_prev,
			type_prev,
			install_from_prev,
			install_to_prev,
			return_from_prev,
			return_to_prev
		} = prev;
		if (
			from == from_prev &&
			to == to_prev &&
			installed == installed_prev &&
			broken == broken_prev &&
			status == status_prev &&
			type == type_prev &&
			install_from == install_from_prev &&
			install_to == install_to_prev &&
			return_from == return_from_prev &&
			return_to == return_to_prev
		) {
			return true;
		} else {
			return false;
		}
	}

	resetFilters() {
		this.props.setSearchCol(null);
		this.props.setSearchTerm(null);
		this.props.setFilters({
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
		});
	}

	componentDidMount() {
		const {
			url,
			currentPage,
			currentLimit,
			disabled,
			params,
			filters,
			searchTerm,
			searchCol
		} = this.props;

		const link = `${url}?page=${currentPage}&limit=${currentLimit}
		${searchTerm ? "&search_term=" + searchTerm : ""}
		${searchCol ? "&search_col=" + searchCol : ""}
		${params ? "&" + params : ""}
		${filters ? "&" + this.makeFilterString(filters) : ""}`;

		if (!disabled) {
			this.resetFilters();

			Axios.get(link).then(res => {
				this.setState({ data: res.data });
				console.log(res);
			});
		}
	}
	componentDidUpdate(prevProps, prevState) {
		if (this.props !== prevProps) {
			const {
				url,
				currentPage,
				currentLimit,
				disabled,
				params,
				searchTerm,
				searchCol,
				filters
			} = this.props;
			const {
				url: prevUrl,
				currentPage: prevCurrentPage,
				currentLimit: prevCurrentLimit,
				disabled: prevDisabled,
				params: prevParams,
				searchTerm: prevSearchTerm,
				filters: prevFilters
			} = prevProps;
			if (
				url !== prevUrl ||
				currentPage !== prevCurrentPage ||
				currentLimit !== prevCurrentLimit ||
				disabled !== prevDisabled ||
				params !== prevParams ||
				searchTerm !== prevSearchTerm ||
				!this.compareFilters(prevFilters, filters)
			) {
				if (prevDisabled !== disabled) {
					this.resetFilters();
				}
				if (!disabled) {
					if (url !== prevUrl) {
						this.resetFilters();
					}
					const link = `${url}?page=${currentPage}&limit=${currentLimit}
					${searchTerm ? "&search_term=" + searchTerm : ""}
					${searchCol ? "&search_col=" + searchCol : ""}
					${params ? "&" + params : ""}
					${filters ? "&" + this.makeFilterString(filters) : ""}`;
					Axios.get(link).then(res => {
						this.setState({ data: res.data });
						console.log(res);
					});
				}
			}
		}
	}
	render() {
		const { render, className } = this.props;
		const { data } = this.state;
		return <div className={className}>{render(data)}</div>;
	}
}

const mapStateToProps = state => ({
	currentPage: state.report.currentPage,
	currentLimit: state.report.currentLimit,
	searchTerm: state.report.searchTerm,
	searchCol: state.report.searchCol,
	filters: state.report.filters
});
const mapDispatchToProps = {
	setSearchCol,
	setSearchTerm,
	setFilters
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FetchDataFromServer);
