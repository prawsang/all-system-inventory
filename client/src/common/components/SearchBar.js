import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { setSearchTerm } from "@/actions/report";
import { connect } from "react-redux";

class SearchBar extends React.Component {
	state = {
		term: ""
	};
	render() {
		const { placeholder, setSearchTerm, searchCol } = this.props;
		const { term } = this.state;
		return (
			<div className={`is-flex is-ai-center ${searchCol || "is-disabled"}`}>
				<input
					className="input"
					placeholder={placeholder ? placeholder : "Search"}
					onChange={e => this.setState({ term: e.target.value })}
				/>
				<button className="button has-ml-05 no-mb" onClick={() => setSearchTerm(term)}>
					<FontAwesomeIcon icon={faSearch} />
				</button>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	searchCol: state.report.searchCol
});

const mapDispatchToProps = {
	setSearchTerm
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchBar);
