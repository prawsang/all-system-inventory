import React from "react";
import SearchField from "../SearchField";
import { setSelectedObject } from "@/actions/record";
import { connect } from "react-redux";

class StaffSearch extends React.Component {
	render() {
		const { disabled, setSelectedObject } = this.props;
		return (
			<SearchField
				responsibleFor="selectedStaff"
				placeholder="Staff Name"
				searchUrl="/staff/get-all"
				searchName="staff_name"
				label="Staff"
				frontEnd={true}
				disabled={disabled}
				listItem={(e,i) => (
					<span
						key={e.staff_name + i}
						className="list-item is-clickable"
						onClick={() =>
							setSelectedObject({ selectedStaff: {
								staff_code: e.staff_code,
								name: e.staff_name
							}})
						}
					>
						{e.staff_name} ({e.staff_code})
					</span>
				)}
			/>
		);
	}
}

const mapDispatchToProps = {
	setSelectedObject
};

export default connect(
	null,
	mapDispatchToProps
)(StaffSearch);
