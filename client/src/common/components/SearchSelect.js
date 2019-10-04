import React from "react";
import { connect } from "react-redux";
import { setSearchCol } from "@/actions/report";

const SearchSelect = props =>
	props.columns && (
		<div className="select has-ml-10">
			<select
				onChange={e => props.setSearchCol(e.target.value)}
				value={props.searchCol ? props.searchCol : ""}
			>
				<option value="">-- Select --</option>
				{props.columns.map((e, i) => (
					<option value={e.col} key={i + e.col}>
						{e.name}
					</option>
				))}
			</select>
		</div>
	);

const mapStateToProps = state => ({
	searchCol: state.report.searchCol
});
const mapDispatchToProps = {
	setSearchCol
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchSelect);
