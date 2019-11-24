import React from "react";
import Table from "@/common/components/InnerTable";
import ItemsTable from "@/common/tables/items";
import { BranchData, CustomerData } from "../../data/";
import Modal from "@/common/components/Modal";
import DeleteModal from "@/common/components/DeleteModal";
import EditModal from "./EditModal";
import ChangeDepartment from "./ChangeDepartment";
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
		changeDepartment: false,
		items: null,
		totalCostOfItems: 0,
		totalSellingPrice: 0
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
		}).then(res => history.push("/report/all-withdrawals"));
	}

	calculatePrice = (data) => {
		let total = 0;
		data.rows.forEach(e => {
			total += parseInt(e.price_per_unit);
		})
		this.setState({ totalCostOfItems: total })
	}

	calculateSellingPrice = (data) => {
		let total = 0;
		data.rows.forEach(e => {
			total += parseInt(e.selling_price_per_unit);
		})
		this.setState({ totalSellingPrice: total })
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
			changeDepartment,
			showDeleteConfirm,
		} = this.state;
		console.log(changeDepartment);
		if (data) {
			if (!data.row) return <p>Not found.</p>;
		}
		return (
			<React.Fragment>
				<h3>Withdrawal ID {data && data.row.withdrawal_id}</h3>
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
										Withdrawal
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
										<label className="is-bold has-mr-05">Staff:</label>
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
								<hr/>
								<div>
									<h5 className="no-mt has-mb-10">
										Costs
									</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Additional Costs:</label>
										<span>{Number(data.row.add_costs).toLocaleString()}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Total Cost of Items:</label>
										<span>{Number(this.state.totalCostOfItems).toLocaleString()} THB</span><br/>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Total Cost:</label>
										<b>{ Number(this.state.totalCostOfItems + parseInt(data.row.add_costs)).toLocaleString()} THB</b><br/>
									</div>
									{ data.row.withdrawal_type === "INSTALLATION" && (
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Total Selling Price:</label>
											<b>{Number(this.state.totalSellingPrice).toLocaleString()} THB</b>
										</div>
									)}
								</div>
								<hr />
								{ data.row.withdrawal_type === "TRANSFER" && (
									<button
										className="button has-mb-10"
										onClick={() => this.setState({ changeDepartment: true })}
										disabled={data.row.withdrawal_status !== "PENDING"}
									>
										Change
									</button>
								)}
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
									<React.Fragment>
										<p className="is-hidden">{ d && Number(this.calculatePrice(d)).toLocaleString()}</p>
										<p className="is-hidden">{ d && Number(this.calculateSellingPrice(d)).toLocaleString()}</p>
										<Table
											data={d}
											table={d => (
												<ItemsTable
													data={d}
													showDelete={data.row.withdrawal_status === "PENDING"}
													withdrawalId={data.row.withdrawal_id}
													showPrice={true}
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
									</React.Fragment>
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
							{ data.row.withdrawal_type === "TRANSFER" && (
								<ChangeDepartment
									data={data.row}
									active={changeDepartment}
									close={() => this.setState({ changeDepartment: false })}
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
		<p>Cancelled withdrawals cannot be used again.</p>
		<div className="buttons">
			<button className="button is-danger" onClick={onSubmit}>
				Cancel
			</button>
			<button className="button is-light" onClick={close}>
				Back
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
