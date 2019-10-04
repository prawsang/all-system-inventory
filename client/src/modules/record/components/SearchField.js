import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";

class SearchField extends React.Component {
	state = {
		data: null
	};
	handleSearch() {
		const { searchUrl, searchTerm, searchName } = this.props;
		if (searchTerm.length < 3) {
			this.setState({ data: null });
		} else {
			Axios.get(`${searchUrl}?search_col=${searchName}&search_term=${searchTerm}`).then(
				res => {
					this.setState({ data: res.data });
					console.log(res);
				}
			);
		}
	}
	handleKeyPress(e) {
		if (e.key === "Enter") {
			this.handleSearch();
		}
	}
	render() {
		const {
			value,
			onChange,
			placeholder,
			list,
			showResults,
			// hideResults,
			disabled
		} = this.props;
		const { data } = this.state;
		return (
			<div className={`field ${disabled && "is-disabled"}`} onFocus={showResults}>
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
					{list(data)}
				</div>
			</div>
		);
	}
}

export default SearchField;
