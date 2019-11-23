import React from "react";
import Modal from "@/common/components/Modal";
import { connect } from "react-redux";
import {
	setSelectedObject,
	resetRecordData
} from "@/actions/record";
import DepartmentSearch from "@/modules/record/components/search/DepartmentSearch";
import Axios from "axios";

class ChangeDepartment extends React.Component {
	componentDidMount() {
		const {
			department_code, 
			department_name 
		} = this.props.data;

		const { setSelectedObject } = this.props;
		setSelectedObject({
			selectedDepartment: {
				department_code,
				name: department_name
			}
		});
	}

	handleEdit() {
		const { data, selectedDepartment } = this.props;
		const {
			withdrawal_type,
			return_by,
			withdrawal_date,
			install_date,
			created_by_staff_code,
		} = data;
		Axios.request({
			method: "PUT",
			url: `/withdrawal/${data.withdrawal_id}/edit`,
			data: {
				created_by_staff_code,
				type: withdrawal_type,
				return_by: return_by,
				date: withdrawal_date,
				install_date: install_date,
				for_department_code: withdrawal_type === "TRANSFER" && selectedDepartment.department_code,
			}
		}).then(res => window.location.reload());
	}

	componentWillUnmount() {
		this.props.resetRecordData();
	}

	render() {
		const { close, active, data } = this.props;
		if (!data) return <p />;

		return (
			<Modal close={close} active={active}>
				<div className="field">
					<DepartmentSearch />
				</div>
				<div className="buttons no-mb">
					<button className="button" onClick={() => this.handleEdit()}>
						Change
					</button>
					<button className="button is-light" onClick={close}>
						Cancel
					</button>
				</div>
			</Modal>
		);
	}
}

const mapStateToProps = state => ({
	selectedDepartment: state.record.selectedDepartment
});

const mapDispatchToProps = {
	setSelectedObject,
	resetRecordData
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChangeDepartment);
