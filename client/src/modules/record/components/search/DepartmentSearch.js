import React from "react";
import SearchField from "../SearchField";
import { setSelectedObject } from "@/actions/record";
import { connect } from "react-redux";

class DepartmentSearch extends React.Component {
	render() {
		const { disabled, setSelectedObject } = this.props;
		return (
			<SearchField
				responsibleFor="selectedDepartment"
				placeholder="Department Name"
				searchUrl="/department/get-all"
				searchName="department_name"
				frontEnd={true}
				staticDataType="departments"
				label="Department"
				disabled={disabled}
				listItem={(e,i) => (
					<span
						key={e.department_name + i}
						className="list-item is-clickable"
						onClick={() =>
							setSelectedObject({ selectedDepartment: {
								department_code: e.department_code,
								name: e.department_name
							}})
						}
					>
						{e.department_name} ({e.department_code})
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
)(DepartmentSearch);
