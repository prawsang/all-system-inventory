import React from "react";
import Modal from "@/common/components/Modal";
import Field from "../../components/Field";
import Axios from "axios";
import StaffSearch from "@/modules/record/components/search/StaffSearch";
import { connect } from "react-redux";
import { setSelectedObject } from "@/actions/record";
import moment from "moment";

class EditModal extends React.Component {
	state = {
		date: "",
		remarks: "",
		installDate: "",
		returnDate: "",
		add_costs: 0
	};

	componentDidMount() {
		const {
			date,
			remarks,
			install_date,
			return_by,
			staff_name,
			staff_code,
			add_costs
		} = this.props.data;
		const { setSelectedObject } = this.props;

		this.setState({
			date: date ? date : "",
			remarks: remarks ? remarks : "",
			installDate: install_date ? install_date : "",
			returnDate: return_by ? return_by : "",
			add_costs: add_costs ? add_costs : ""
		});
		setSelectedObject({
			selectedStaff: {
				staff_code,
				name: staff_name
			}
		})
	}

	handleEdit() {
		const { data, selectedStaff } = this.props;
		const { installDate, returnDate, add_costs } = this.state;
		Axios.request({
			method: "PUT",
			url: `/withdrawal/${data.withdrawal_id}/edit`,
			data: {
				for_branch_code: data.for_branch_code,
				for_department_code: data.for_department_code,
				type: data.withdrawal_type,
				return_by: returnDate,
				add_costs,
				date: moment(),
				install_date: installDate,
				created_by_staff_code: selectedStaff.staff_code
			}
		}).then(res => window.location.reload());
	}

	render() {
		const { active, close, data } = this.props;
		const { installDate, returnDate, add_costs } = this.state;
		return (
			<Modal active={active} close={close} title="Edit Withdrawal">
				<Field editable={false} value={data.withdrawal_id} label="Withdrawal ID" />
				<Field editable={false} value={data.withdrawal_type} label="Type" />
				<Field
					editable={true}
					label="Additional Costs"
					placeholder="Additional Costs (e.g. Shipping, Installation Costs)"
					value={add_costs}
					onChange={e => this.setState({ add_costs: e.target.value })}
				/>
				<StaffSearch />
				{data.type === "LENDING" && (
					<Field
						editable={true}
						type="date"
						label="Return Date"
						value={returnDate}
						onChange={e => this.setState({ returnDate: e.target.value })}
					/>
				)}
				{data.type === "INSTALLATION" && (
					<Field
						editable={true}
						type="date"
						label="Install Date"
						value={installDate}
						onChange={e => this.setState({ installDate: e.target.value })}
					/>
				)}
				<div className="buttons">
					<button className="button" onClick={() => this.handleEdit()}>
						Confirm
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
	selectedStaff: state.record.selectedStaff
})

const mapDispatchToProps = {
	setSelectedObject
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditModal);
