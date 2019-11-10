import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class EditDepartment extends React.Component {
	state = {
		name: ""
	};

	edit() {
		const { name } = this.state;
		const { department } = this.props;
		Axios.request({
			method: "PUT",
			url: `/department/${department.department_code}/edit`,
			data: {
				name
			}
		}).then(res => window.location.reload());
	}

	componentDidMount() {
		const { department } = this.props;
		this.setState({ name: department.department_name });
	}

	render() {
		const { name } = this.state;
		const { close, active } = this.props;

		return (
			<Modal active={active} close={close} title="Edit Department">
				<div className="form">
					<div className="field">
						<label className="label">Department Name</label>
						<input
							className="input is-fullwidth"
							placeholder="Department Name"
							onChange={e => this.setState({ name: e.target.value })}
							value={name}
						/>
					</div>
					<div className="buttons">
						<button className="button" onClick={() => this.edit()}>
							Edit
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

export default EditDepartment;
