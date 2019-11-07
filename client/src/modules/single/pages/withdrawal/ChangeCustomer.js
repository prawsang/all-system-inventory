import React from "react";
import Modal from "@/common/components/Modal";
import { connect } from "react-redux";
import {
	setSelectedObject,
	resetRecordData
} from "@/actions/record";
import CustomerSearch from "@/modules/record/components/search/CustomerSearch";
import BranchSearch from "@/modules/record/components/search/BranchSearch";
import DepartmentSearch from "@/modules/record/components/search/DepartmentSearch";
import Axios from "axios";

class ChangeCustomer extends React.Component {
	componentDidMount() {
		const { branch_code, 
			branch_name, 
			customer_code, 
			customer_name, 
			department_code, 
			department_name 
		} = this.props.data;
		const { setSelectedObject } = this.props;
		setSelectedObject({
			selectedCustomer: {
				customer_code,
				name: customer_name
			},
			selectedBranch: {
				branch_code,
				name: branch_name
			},
			selectedDepartment: {
				department_code,
				name: department_name
			}
		});
	}

	handleEdit() {
		const { data, selectedBranch, selectedDepartment } = this.props;
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
				for_branch_code: withdrawal_type !== "TRANSFER" && selectedBranch.branch_code,
				for_department_code: withdrawal_type === "TRANSFER" && selectedDepartment.department_code,
			}
		}).then(res => window.location.reload());
	}

	componentWillUnmount() {
		this.props.resetRecordData();
	}

	render() {
		const { close, active, selectedCustomer, data } = this.props;
		console.log(data);
		if (!data) return <p />;

		return (
			<Modal close={close} active={active}>
				<div className="field">
					<CustomerSearch disabled={data.withdrawal_type === "TRANSFER"}/>
				</div>
				<div className="field">
					<BranchSearch disabled={!selectedCustomer || data.withdrawal_type === "TRANSFER"} />
				</div>
				<div className="field">
					<DepartmentSearch disabled={data.withdrawal_type !== "TRANSFER"} />
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
	selectedCustomer: state.record.selectedCustomer,
	selectedBranch: state.record.selectedBranch,
	selectedDepartment: state.record.selectedDepartment
});

const mapDispatchToProps = {
	setSelectedObject,
	resetRecordData
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChangeCustomer);
