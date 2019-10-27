import React from "react";
import Modal from "@/common/components/Modal";
import { connect } from "react-redux";
import {
	setSelectedCustomer,
	setSelectedBranch,
	resetRecordData
} from "@/actions/record";
import CustomerSearch from "@/modules/record/components/search/CustomerSearch";
import BranchSearch from "@/modules/record/components/search/BranchSearch";
import Axios from "axios";

class ChangeCustomer extends React.Component {
	componentDidMount() {
		this.props.resetRecordData();

		const { branch } = this.props.data;
		const { setSelectedCustomer, setSelectedBranch } = this.props;
		setSelectedCustomer(branch.customer);
		setSelectedBranch(branch);
	}

	handleEdit() {
		const { data, selectedBranches } = this.props;
		const {
			type,
			return_by,
			date,
			install_date,
			created_by_staff_code,
			for_department_code
		} = data;
		Axios.request({
			method: "PUT",
			url: `/withdrawal/${data.id}/edit`,
			data: {
				created_by_staff_code,
				type: type,
				return_by: return_by,
				date: date,
				install_date: install_date,
				for_branch_code: selectedBranches[0].branch_code,
				for_department_code,
			}
		}).then(res => window.location.reload());
	}

	componentWillUnmount() {
		this.props.resetRecordData();
	}

	render() {
		const { close, active, selectedCustomer, data } = this.props;
		if (!data) return <p />;

		return (
			<Modal close={close} active={active}>
				<div className="is-disabled">
					<div className="field">
						<label className="label has-mb-05">Customer Name:</label>
						<CustomerSearch />
					</div>
				</div>
				<div className="field">
					<label className="label has-mb-05">Branch Name:</label>
					<BranchSearch disabled={!selectedCustomer} />
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
});

const mapDispatchToProps = {
	setSelectedCustomer,
	setSelectedBranch,
	resetRecordData
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChangeCustomer);
