import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";
import { connect } from "react-redux";
import DepartmentSearch from "@/modules/record/components/search/DepartmentSearch";
import { setSelectedObject } from "@/actions/record";

class EditStaff extends React.Component {
	state = {
		name: "",
	};

	edit() {
		const {
			name,
		} = this.state;
		const { staff, selectedDepartment } = this.props;
		Axios.request({
			method: "PUT",
			url: `/staff/${staff.staff_code}/edit`,
			data: {
				staff_code: staff.staff_code,
				name,
				works_for_dep_code: selectedDepartment.department_code
			}
		}).then(res => window.location.reload());
	}

	componentDidMount() {
		const { staff } = this.props;
		this.setState({
			name: staff.staff_name,
		});
		this.props.setSelectedObject({
			selectedDepartment: {
				department_code: staff.department_code,
				name: staff.department_name
			}
		})
	}

	render() {
		const {
			name,
		} = this.state;
		const { close, active } = this.props;

		return (
			<Modal active={active} close={close} title="Edit Staff">
				<div className="form">
					<div className="field">
						<label className="label">Branch Name</label>
						<input
							className="input is-fullwidth"
							placeholder="Branch Name"
							onChange={e => this.setState({ name: e.target.value })}
							value={name}
						/>
					</div>
					<DepartmentSearch />
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

const mapStateToProps = state => ({
	selectedDepartment: state.record.selectedDepartment
})
const mapDispatchToProps = {
	setSelectedObject
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditStaff);
