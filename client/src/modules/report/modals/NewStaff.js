import React from "react";
import Axios from "axios";
import DepartmentSearch from "@/modules/record/components/search/DepartmentSearch"
import { setSelectedObject } from "@/actions/record";
import { connect } from "react-redux";

class StaffModal extends React.Component {
	state = {
		staffCode: "",
		staffName: "",
	};
	handleSubmit() {
		const { staffName, staffCode } = this.state;
		const { selectedDepartment } = this.props;
		Axios.request({
			method: "POST",
			url: "/staff/add",
			data: {
				name: staffName,
				works_for_dep_code: selectedDepartment.department_code,
				staff_code: staffCode,
			}
		}).then(res => window.location.reload());
	}

	render() {
		const { staffName, staffCode } = this.state
		return (
			<div>
				<div className="field">
					<label className="label">Staff Code</label>
					<input
						className="input is-fullwidth"
						placeholder="Staff Code"
						value={staffCode}
						onChange={e => this.setState({ staffCode: e.target.value })}
					/>
				</div>
				<div className="field">
					<label className="label">Staff Name</label>
					<input
						className="input is-fullwidth"
						placeholder="Staff Name"
						value={staffName}
						onChange={e => this.setState({ staffName: e.target.value })}
					/>
				</div>
				<div className="field">
					<DepartmentSearch />
				</div>
				<button className="button" onClick={() => this.handleSubmit()}>
					Add
				</button>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	selectedDepartment: state.record.selectedDepartment
})
const mapDispatchToProps = {
	setSelectedObject
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(StaffModal);
