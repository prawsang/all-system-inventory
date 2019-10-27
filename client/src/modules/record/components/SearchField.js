import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";

class SearchField extends React.Component {
	state = {
		data: null,
		searchedDataFrontEnd: null
	};
	handleSearch() {
		const { searchUrl, searchTerm, searchName, frontEnd } = this.props;
		if (searchTerm.length < 3 && !frontEnd) {
			this.setState({ data: null });
		} else {
			Axios.get(`${searchUrl}?search_col=${searchName}&search_term=${searchTerm}`).then(
				res => {
					this.setState({ data: res.data });
					if (frontEnd) {
						this.setState({ searchedDataFrontEnd: res.data.rows })
					}
					console.log(res);
				}
			);
		}
	}
	handleSearchFrontEnd() {
		const { searchTerm, searchName } = this.props;
		const { data } = this.state;
		if (searchTerm.length >= 3) {
			this.setState({
				searchedDataFrontEnd: data ? data.rows.filter(e => e[searchName].includes(searchTerm)) : null
			});
		}
	}
	handleKeyPress(e) {
		const { frontEnd } = this.props;
		if (e.key === "Enter") {
			if (frontEnd) {
				this.handleSearchFrontEnd();
			} else {
				this.handleSearch();
			}
		}
	}
	componentDidMount() {
		const { frontEnd } = this.props;
		if (frontEnd) {
			this.handleSearch();
		}
	}
	render() {
		const {
			value,
			label,
			onChange,
			placeholder,
			list,
			showResults,
			frontEnd,
			disabled,
		} = this.props;
		const { data, searchedDataFrontEnd } = this.state;
		return (
			<div className={`field ${disabled && "is-disabled"}`} onFocus={showResults}>
				<label className="label has-no-line-break">{label}</label>
				<div className="is-flex">
					<input
						className="input is-flex-fullwidth"
						placeholder={placeholder}
						value={value}
						onChange={onChange}
						onKeyPress={e => this.handleKeyPress(e)}
						disabled={disabled}
					/>
					<button
						className="button has-ml-05 no-mb"
						type="button"
						onClick={() => this.handleSearch()}
					>
						<FontAwesomeIcon icon={faSearch} />
					</button>
					{list(frontEnd ? {
						rows: searchedDataFrontEnd
					} : data)}
				</div>
			</div>
		);
	}
}

export default SearchField;
