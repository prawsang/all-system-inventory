import React from "react";
import CustomerSearch from "../components/search/CustomerSearch";
import BranchSearch from "../components/search/BranchSearch";
import DepartmentSearch from "../components/search/DepartmentSearch";
import StaffSearch from "../components/search/StaffSearch";
import { connect } from "react-redux";
import Axios from "axios";
import { resetRecordData } from "@/actions/record";
import history from "@/common/history";
import moment from "moment";

const INSTALLATION = "INSTALLATION";
const LENDING = "LENDING";
const TRANSFER = "TRANSFER";

class Withdraw extends React.Component {
	state = {
		type: INSTALLATION,
		returnDate: "",
		installDate: "",
		remarks: "",
	};

	async handleSubmit() {
		const {
			type,
			returnDate,
			installDate,
			remarks,
		} = this.state;
		const { selectedBranch, selectedStaff, selectedDepartment } = this.props;
		
		await Axios.request({
			method: "POST",
			url: "/withdrawal/add",
			data: {
				type,
				date: moment().format(),
				return_by: type === LENDING ? returnDate : null,
				install_date: type === INSTALLATION ? installDate : null,
				for_branch_code: type !== TRANSFER && selectedBranch.branch_code,
				remarks,
				created_by_staff_code: selectedStaff.staff_code,
				for_department_code: type === TRANSFER && selectedDepartment.department_code
			}
		}).then(res => {
			history.push(`/single/withdrawal/${res.data.rows[0].id}`)
		});
	}

	componentDidMount() {
		this.props.resetRecordData();
	}
	componentWillUnmount() {
		this.props.resetRecordData();
	}
	
	render() {
		const {
			type,
			returnDate,
			installDate,
			remarks,
		} = this.state;
		const { selectedCustomer } = this.props;

		return (
			<div className="content">
				<h3>เบิกสินค้า</h3>
				<div className="panel">
					<div className="panel-content">
						<div className="field is-flex is-ai-center">
							<label className="label has-mr-05 is-bold">Type:</label>
							<div className="select no-mb">
								<select
									value={type}
									onChange={e => {
										this.setState({ type: e.target.value });
									}}
								>
									<option value={INSTALLATION}>เบิกไปติดตั้ง</option>
									<option value={LENDING}>ยืมสินค้า</option>
									<option value={TRANSFER}>โอนสินค้าไปแผนกอื่น</option>
								</select>
							</div>
						</div>
						<StaffSearch />
						{type === LENDING && (
							<Field
								type="date"
								placeholder="Return Date"
								label="Return Date"
								value={returnDate}
								onChange={e => this.setState({ returnDate: e.target.value })}
							/>
						)}
						{type === INSTALLATION && (
							<Field
								type="date"
								placeholder="Install Date"
								label="Install Date"
								value={installDate}
								onChange={e => this.setState({ installDate: e.target.value })}
							/>
						)}
						<hr />
						{ type === TRANSFER ? (
							<DepartmentSearch />
						) : (
							<React.Fragment>
								<CustomerSearch />
								<BranchSearch
									disabled={!selectedCustomer}
								/>
							</React.Fragment>
						)}
						<hr />
						<div className="field">
							<label className="label" style={{ display: "block" }}>
								Remarks:
							</label>
							<textarea
								type="text"
								value={remarks}
								onChange={e => this.setState({ remarks: e.target.value })}
								placeholder="Remarks"
								className="input textarea is-fullwidth"
							/>
						</div>
						<button className="button has-mt-10" onClick={() => this.handleSubmit()}>
							เปิดใบเบิกสินค้า
						</button>
					</div>
				</div>
			</div>
		);
	}
}

const Field = ({ value, onChange, placeholder, className, label, type, inputClass }) => (
	<div className={className ? className : "field is-flex is-ai-center"}>
		<label className="label">{label}:</label>
		<input
			type={type ? type : "text"}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			className={`input ${inputClass}`}
		/>
	</div>
);

const mapStateToProps = state => ({
	selectedCustomer: state.record.selectedCustomer,
	selectedBranch: state.record.selectedBranch,
	selectedStaff: state.record.selectedStaff,
	selectedDepartment: state.record.selectedDepartment
});

const mapDispatchToProps = {
	resetRecordData
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Withdraw);
