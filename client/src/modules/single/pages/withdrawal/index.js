import React from "react";
import Table from "@/common/components/InnerTable";
import ItemsTable from "@/common/tables/items";
import { BranchData, CustomerData } from "../../data/";
import Modal from "@/common/components/Modal";
import DeleteModal from "@/common/components/DeleteModal";
import EditModal from "./EditModal";
import ChangeCustomer from "./ChangeCustomer";
import RemarksModal from "./RemarksModal";
import Axios from "axios";
import { Link } from "react-router-dom";
import history from "@/common/history";
import { setCurrentWithdrawal, setItems } from "@/actions/withdrawal";
import { connect } from "react-redux";
import { formatDate } from "@/common/date";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";

class Withdrawal extends React.PureComponent {
	state = {
		edit: false,
		showCancelConfirm: false,
		showDeleteConfirm: false,
		editRemarks: false,
		changeCustomer: false,
		items: null
	};

	confirmWithdrawal() {
		const { data } = this.props;
		Axios.request({
			method: "PUT",
			url: `/withdrawal/${data.row.withdrawal_id}/change-status`,
			data: {
				status: "CONFIRMED"
			}
		})
		.then(res => window.location.reload());
	}

	cancelWithdrawal() {
		const { data } = this.props;
		Axios.request({
			method: "PUT",
			url: `/withdrawal/${data.row.withdrawal_id}/change-status`,
			data: {
				status: "CANCELLED"
			}
		}).then(res => window.location.reload());
	}

	deleteWithdrawal() {
		const { data } = this.props;
		Axios.request({
			method: "DELETE",
			url: `/withdrawal/${data.row.withdrawal_id}/delete`
		}).then(res => history.push("/"));
	}

	// async handlePrint() {
	// 	const { data } = this.props;
	// 	this.props.setCurrentWithdrawal(data.row);
	// 	await Axios.request({
	// 		method: "GET",
	// 		url: `/withdrawal/${data.row.withdrawal_id}/items`
	// 	}).then(res => {
	// 		this.props.setItems(res.data.rows);
	// 	});
	// }

	render() {
		const { data } = this.props;
		const {
			edit,
			showCancelConfirm,
			editRemarks,
			changeCustomer,
			showDeleteConfirm,
		} = this.state;
		if (data) {
			if (!data.row) return <p>ไม่พบรายการ</p>;
		}
		return (
			<React.Fragment>
				<h3>ใบเบิกหมายเลข {data && data.row.withdrawal_id}</h3>
				<div className="panel">
					{data && (
						<React.Fragment>
							<div className="panel-content no-pb" style={{ position: "relative" }}>
								<div style={{ float: "right" }}>
									<button
										className="button"
										onClick={() => this.confirmWithdrawal()}
										disabled={data.row.withdrawal_status !== "PENDING"}
									>
										Confirm
									</button>
									<button
										className="button is-danger"
										onClick={() =>
											this.setState({
												showCancelConfirm: true
											})
										}
										disabled={data.row.withdrawal_status === "CANCELLED"}
									>
										Cancel
									</button>
									<button
										className="button is-danger"
										onClick={() =>
											this.setState({
												showDeleteConfirm: true
											})
										}
										disabled={data.row.withdrawal_status !== "CANCELLED"}
									>
										Delete
									</button>
								</div>
								<div>
									<h5 className="no-mt has-mb-10">
										ใบเบิก
										<span
											className={`is-clickable accent has-ml-10 is-6 ${data
												.row.withdrawal_status === "PENDING" || "is-disabled"}`}
											onClick={() => this.setState({ edit: true })}
										>
											Edit
										</span>
									</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Type:</label>
										<span>{data.row.withdrawal_type}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Status:</label>
										<span>{data.row.withdrawal_status}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Date:</label>
										<span>{formatDate(data.row.withdrawal_date)}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">ผู้เบิก:</label>
										<span>{data.row.staff_name}</span>
									</div>
									{data.row.type === "LENDING" && (
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Return By:</label>
											<span>{formatDate(data.row.return_by)}</span>
										</div>
									)}
									{data.row.type === "INSTALLATION" && (
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">
												Install Date:
											</label>
											<span>{formatDate(data.row.install_date)}</span>
										</div>
									)}
								</div>
								<hr />
								<div>
									<h5 className="no-mt has-mb-10">
										Remarks
										<span
											className="is-clickable accent has-ml-10 is-6"
											onClick={() => this.setState({ editRemarks: true })}
										>
											Edit
										</span>
									</h5>
									<div className="has-mb-10">
										<span>
											{data.row.withdrawal_remarks
												? data.row.withdrawal_remarks
												: "No Remarks"}
										</span>
									</div>
								</div>
								<hr />
								<button
									className="button has-mb-10"
									onClick={() => this.setState({ changeCustomer: true })}
									disabled={data.row.withdrawal_status !== "PENDING"}
								>
									Change
								</button>
								{ data.row.withdrawal_type !== "TRANSFER" ? (
									<React.Fragment>
										<div style={{ marginBottom: "2em" }}>
											<CustomerData data={{
												customer_code: data.row.customer_code,
												customer_name: data.row.customer_name
											}} />
										</div>
										<div style={{ marginBottom: "2em" }}>
											<BranchData data={{
												branch_code: data.row.branch_code,
												branch_name: data.row.branch_name,
												address: data.row.address,
											}} />
										</div>
									</React.Fragment>
								) : (
									<React.Fragment>
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Department:</label>
											<span>{data.row.department_name} ({data.row.for_department_code})</span>
										</div>
									</React.Fragment>
								)}
								<hr />
								<Link to={`/single/withdrawal/${data.row.withdrawal_id}/add-items`}>
									<button
										className="button has-mb-10"
										disabled={data.row.withdrawal_status !== "PENDING"}
									>
										Add Items
									</button>
								</Link>
							</div>
							<FetchDataFromServer
								url={data && `/withdrawal/${data.row.withdrawal_id}/items`}
								render={d => (
									<Table
										data={d}
										table={d => (
											<ItemsTable
												data={d}
												showDelete={data.row.withdrawal_status === "PENDING"}
												withdrawalId={data.row.withdrawal_id}
											/>
										)}
										className="no-pt"
										title="Items"
										filters={{
											itemType: true
										}}
										columns={[
											{
												col: "serial_no",
												name: "Serial No."
											},
											{
												col: "model_name",
												name: "Model Name"
											}
										]}
									/>
								)}
							/>
							<EditModal
								data={data.row}
								active={edit}
								close={() => this.setState({ edit: false })}
							/>
							<RemarksModal
								data={data.row}
								active={editRemarks}
								close={() => this.setState({ editRemarks: false })}
							/>
							{ data.row.type !== "TRANSFER" && (
								<ChangeCustomer
									data={data.row}
									active={changeCustomer}
									close={() => this.setState({ changeCustomer: false })}
								/>
							)}
							<CancelConfirm
								onSubmit={() => this.cancelWithdrawal()}
								close={() => this.setState({ showCancelConfirm: false })}
								active={showCancelConfirm}
							/>
							<DeleteModal 
								active={showDeleteConfirm}
								close={() => this.setState({ showDeleteConfirm: false })}
								onDelete={() => this.deleteWithdrawal()}
							/>
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const CancelConfirm = ({ onSubmit, close, active }) => (
	<Modal title="Confirm" close={close} active={active}>
		<p>เมื่อ Cancel แล้ว ใบเบิกนี้จะไม่สามารถนำกลับมาใช้ได้อีก</p>
		<div className="buttons">
			<button className="button is-danger" onClick={onSubmit}>
				Cancel ใบเบิก
			</button>
			<button className="button is-light" onClick={close}>
				ไม่ Cancel
			</button>
		</div>
	</Modal>
);

const mapDispatchToProps = {
	setCurrentWithdrawal,
	setItems
};

export default connect(
	null,
	mapDispatchToProps
)(Withdrawal);
