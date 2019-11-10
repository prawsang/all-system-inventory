import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class AddStaff extends React.Component {
	state = {
		staffCode: "",
		name: "",
		address: "",
	};

	addStaff() {
		const {
			staffCode,
			name,
		} = this.state;
		const { department } = this.props;
		Axios.request({
			method: "POST",
			url: "/staff/add",
			data: {
				works_for_dep_code: department.department_code,
				staff_code: staffCode,
				name,
			}
		}).then(res => window.location.reload());
	}

	render() {
		const {
			staffCode,
			name,
		} = this.state;
		const { close, active, department } = this.props;

		return (
			<Modal active={active} close={close} title="Add New Staff">
				<div className="form">
					<p>
						ลูกค้า: <b>{department && department.department_name}</b>
					</p>
					<div className="field">
						<label className="label">Staff Code</label>
						<input
							className="input is-fullwidth"
							placeholder="Staff Code"
							onChange={e => this.setState({ staffCode: e.target.value })}
							value={staffCode}
						/>
					</div>
					<div className="field">
						<label className="label">Staff Name</label>
						<input
							className="input is-fullwidth"
							placeholder="Staff Name"
							onChange={e => this.setState({ name: e.target.value })}
							value={name}
						/>
					</div>
					<div className="buttons">
						<button className="button" onClick={() => this.addStaff()}>
							Add Staff
						</button>
						<button className="button is-light" onClick={close}>
							Cancel
						</button>
					</div>
				</div>
			</Modal>
		);
	}
}

export default AddStaff;
