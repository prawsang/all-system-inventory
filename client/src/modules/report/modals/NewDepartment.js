import React from "react";
import Axios from "axios";
import history from "@/common/history";

class NewDepartment extends React.Component {
	state = {
		departmentCode: "",
		departmentName: ""
	};
	handleAdd() {
		const { departmentCode, departmentName } = this.state;
		Axios.request({
			method: "POST",
			url: "/department/add",
			data: {
				department_code: departmentCode,
				name: departmentName
			}
		}).then(res => history.push(`/single/department/${res.data.rows[0].department_code}`));
	}
	render() {
		const { departmentCode, departmentName } = this.state;
		return (
			<div>
				<div className="field">
					<label className="label">Department Code</label>
					<input
						className="input is-fullwidth"
						placeholder="Department Code"
						value={departmentCode}
						onChange={e => this.setState({ departmentCode: e.target.value })}
					/>
				</div>
				<div className="field">
					<label className="label">Department Name</label>
					<input
						className="input is-fullwidth"
						placeholder="Department Name"
						value={departmentName}
						onChange={e => this.setState({ departmentName: e.target.value })}
					/>
				</div>
				<button className="button" onClick={() => this.handleAdd()}>
					Add
				</button>
			</div>
		);
	}
}

export default NewDepartment;
