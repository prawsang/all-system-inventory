import React from "react";
import Modal from "@/common/components/Modal";
import Field from "../../components/Field";
import Axios from "axios";

class EditModal extends React.Component {
	state = {
		date: "",
		remarks: "",
		installDate: "",
		returnDate: "",
		staffs: [],
		selectedStaffCode: null
	};

	getAllStaff = () => {
		Axios.get(`/staff/get-all`).then(res => {
			this.setState({ staffs: res.data.rows });
			console.log(res);
		});
	}

	componentDidMount() {
		const {
			date,
			po_number,
			do_number,
			remarks,
			install_date,
			return_by,
			staff_name
		} = this.props.data;
		this.getAllStaff();
		this.setState({
			date: date ? date : "",
			poNumber: po_number ? po_number : "",
			doNumber: do_number ? do_number : "",
			remarks: remarks ? remarks : "",
			installDate: install_date ? install_date : "",
			returnDate: return_by ? return_by : "",
			staffName: staff_name ? staff_name : ""
		});
	}

	handleEdit() {
		const { data } = this.props;
		const { date, installDate, returnDate, staffName, selectedStaffCode } = this.state;
		Axios.request({
			method: "PUT",
			url: `/withdrawal/${data.id}/edit`,
			data: {
				for_branch_code: data.for_branch_code,
				for_department_code: data.for_department_code,
				type: data.type,
				return_by: returnDate,
				date,
				install_date: installDate,
				created_by_staff_code: selectedStaffCode
			}
		}).then(res => window.location.reload());
	}

	render() {
		const { active, close, data } = this.props;
		const { date, installDate, returnDate, staffs, selectedStaffCode } = this.state;
		return (
			<Modal active={active} close={close} title="แก้ไขใบเบิก">
				<Field editable={false} value={data.id} label="หมายเลขใบเบิก" />
				<Field editable={false} value={data.type} label="Type" />
				<Field
					editable={true}
					type="date"
					label="Date"
					value={date}
					onChange={e => this.setState({ date: e.target.value })}
				/>
				<div className="field is-flex is-ai-center">
					<label className="label has-mr-05 is-bold">Staff:</label>
					<div className="select no-mb">
						<select
							value={selectedStaffCode}
							onChange={e => {
								this.setState({ selectedStaffCode: e.target.value });
							}}
						>
							{ staffs.map((e,i) => 	
								<option value={e.staff_code}>{e.staff_name} ({e.staff_code})</option>
							)}
						</select>
					</div>
				</div>
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

export default EditModal;
