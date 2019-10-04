import React from "react";
import Modal from "@/common/components/Modal";
import { connect } from "react-redux";
import {
	setSelectedCustomer,
	setSelectedBranches,
	resetRecordData
} from "@/actions/record";
import CustomerSearch from "@/modules/record/components/search/CustomerSearch";
import BranchSearch from "@/modules/record/components/search/BranchSearch";
import Axios from "axios";

class ChangeCustomer extends React.Component {
	componentDidMount() {
		this.props.resetRecordData();

		const { branch } = this.props.data;
		const { setSelectedCustomer, setSelectedBranches } = this.props;
		setSelectedCustomer(branch.customer);
		setSelectedBranches([branch]);
	}

	handleEdit() {
		const { data, selectedJobCode, selectedBranches } = this.props;
		const {
			po_number,
			do_number,
			type,
			return_by,
			date,
			install_date,
			staff_name
		} = data;
		Axios.request({
			method: "PUT",
			url: `/withdrawal/${data.id}/edit`,
			data: {
				job_code: selectedJobCode,
				branch_id: selectedBranches[0].id,
				po_number: po_number,
				do_number: do_number,
				staff_name: staff_name,
				type: type,
				return_by: return_by,
				date: date,
				install_date: install_date,
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
					<BranchSearch single={true} disabled={!selectedCustomer} />
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
	selectedBranches: state.record.selectedBranches,
});

const mapDispatchToProps = {
	setSelectedCustomer,
	setSelectedBranches,
	resetRecordData
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChangeCustomer);
