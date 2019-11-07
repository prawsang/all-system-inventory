import React from "react";
import SearchField from "../SearchField";
import { setSelectedObject } from "@/actions/record";
import { connect } from "react-redux";

class BranchSearch extends React.Component {
	render() {
		const { disabled, setSelectedObject, selectedCustomer } = this.props;
		return (
			<SearchField
				responsibleFor="selectedBranch"
				placeholder="Branch Name"
				searchUrl={selectedCustomer ? `/customer/${selectedCustomer.customer_code}/branches` : ""}
				searchName="branch_name"
				label="Branch"
				disabled={disabled || !selectedCustomer}
				listItem={(e,i) => (
					<span
						key={e.branch_name + i}
						className="list-item is-clickable"
						onClick={() =>
							setSelectedObject({ selectedBranch: {
								branch_code: e.branch_code,
								name: e.branch_name
							}})
						}
					>
						{e.branch_name} ({e.branch_code})
					</span>
				)}
			/>
		);
	}
}

const mapStateToProps = state => ({
	selectedCustomer: state.record.selectedCustomer
})

const mapDispatchToProps = {
	setSelectedObject
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BranchSearch);
