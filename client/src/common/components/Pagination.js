import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { setPage } from "@/actions/report";

class Pagination extends React.Component {
	renderPageNumbers = totalPages =>
		new Array(totalPages).fill().map((e, i) => (
			<button
				className={`button ${this.props.currentPage === i + 1 ? "" : "is-light"}`}
				key={i}
				onClick={() => this.props.setPage(i + 1)}
			>
				{i + 1}
			</button>
		));
	handlePageChange(page) {
		this.props.setPage(page);
	}

	render() {
		const { totalPages, currentPage } = this.props;
		return (
			<div className="buttons no-mb">
				<button
					className="button is-light"
					onClick={() => this.handlePageChange(currentPage - 1)}
					disabled={currentPage === 1 || totalPages === 0}
				>
					<FontAwesomeIcon icon={faAngleLeft} />
				</button>
				{this.renderPageNumbers(totalPages)}
				<button
					className="button is-light"
					onClick={() => this.handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages || totalPages === 0}
				>
					<FontAwesomeIcon icon={faAngleRight} />
				</button>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	currentPage: state.report.currentPage
});
const mapDispatchToProps = {
	setPage
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Pagination);
