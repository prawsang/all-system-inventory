import React from "react";
import Table from "@/common/components/InnerTable";
import ItemsTable from "@/common/tables/items";
import { BranchData, CustomerData } from "../../data/";
import Modal from "@/common/components/Modal";
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
		editBilling: false,
		items: null
	};

	cancelWithdrawal() {
		const { data } = this.props;
		Axios.request({
			method: "PUT",
			url: `/withdrawal/${data.withdrawal.id}/change-status`,
			data: {
				status: "CANCELLED"
			}
		}).then(res => window.location.reload());
	}

	deleteWithdrawal() {
		const { data } = this.props;
		Axios.request({
			method: "DELETE",
			url: `/withdrawal/${data.withdrawal.id}`
		}).then(res => history.push("/"));
	}

	async handlePrint() {
		const { data } = this.props;
		this.props.setCurrentWithdrawal(data.withdrawal);
		await Axios.request({
			method: "GET",
			url: `/withdrawal/${data.withdrawal.id}/items`
		}).then(res => {
			this.props.setItems(res.data.rows);
		});
	}

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
			if (!data.withdrawal) return <p>ไม่พบรายการ</p>;
		}
		return (
			<React.Fragment>
				<h3>ใบเบิกหมายเลข {data && data.withdrawal.id}</h3>
				<div className="panel">
					{data && (
						<React.Fragment>
							<div className="panel-content no-pb" style={{ position: "relative" }}>
								<div style={{ float: "right" }}>
									<button
										className="button is-danger"
										onClick={() =>
											this.setState({
												showCancelConfirm: true
											})
										}
										disabled={data.withdrawal.status === "CANCELLED"}
									>
										Cancel
									</button>
								</div>
								<div>
									<h5 className="no-mt has-mb-10">
										ใบเบิก
										<span
											className={`is-clickable accent has-ml-10 is-6 ${data
												.withdrawal.status === "PENDING" || "is-disabled"}`}
											onClick={() => this.setState({ edit: true })}
										>
											Edit
										</span>
									</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Type:</label>
										<span>{data.withdrawal.type}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Status:</label>
										<span>{data.withdrawal.status}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Date:</label>
										<span>{formatDate(data.withdrawal.date)}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">ผู้เบิก:</label>
										<span>{data.withdrawal.staff.staff_name}</span>
									</div>
									{data.withdrawal.type === "LENDING" && (
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Return By:</label>
											<span>{formatDate(data.withdrawal.return_by)}</span>
										</div>
									)}
									{data.withdrawal.type === "INSTALLATION" && (
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">
												Install Date:
											</label>
											<span>{formatDate(data.withdrawal.install_date)}</span>
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
											{data.withdrawal.remarks
												? data.withdrawal.remarks
												: "No Remarks"}
										</span>
									</div>
								</div>
								<hr />
								<button
									className="button has-mb-10"
									onClick={() => this.setState({ changeCustomer: true })}
									disabled={data.withdrawal.status !== "PENDING"}
								>
									Change
								</button>
								<div style={{ marginBottom: "2em" }}>
									<CustomerData data={data.withdrawal.branch.customer} />
								</div>
								<div style={{ marginBottom: "2em" }}>
									<BranchData data={data.withdrawal.branch} />
								</div>
								<hr />
								<Link to={`/single/withdrawal/${data.withdrawal.id}/add-items`}>
									<button
										className="button has-mb-10"
										disabled={data.withdrawal.status !== "PENDING"}
									>
										Add Items
									</button>
								</Link>
							</div>
							<FetchDataFromServer
								url={data && `/withdrawal/${data.withdrawal.id}/items`}
								render={d => (
									<Table
										data={d}
										table={d => (
											<ItemsTable
												data={d}
												showDelete={data.withdrawal.status === "PENDING"}
												withdrawalId={data.withdrawal.id}
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
								data={data.withdrawal}
								active={edit}
								close={() => this.setState({ edit: false })}
							/>
							<RemarksModal
								data={data.withdrawal}
								active={editRemarks}
								close={() => this.setState({ editRemarks: false })}
							/>
							<ChangeCustomer
								data={data.withdrawal}
								active={changeCustomer}
								close={() => this.setState({ changeCustomer: false })}
							/>
							<CancelConfirm
								onSubmit={() => this.cancelWithdrawal()}
								close={() => this.setState({ showCancelConfirm: false })}
								active={showCancelConfirm}
							/>
							<DeleteConfirm
								onSubmit={() => this.deleteWithdrawal()}
								close={() => this.setState({ showDeleteConfirm: false })}
								active={showDeleteConfirm}
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

const DeleteConfirm = ({ onSubmit, close, active }) => (
	<Modal title="Confirm" close={close} active={active}>
		<p>เมื่อลบใบเบิกแล้ว จะไม่สามารถนำกลับมาได้อีก</p>
		<div className="buttons">
			<button className="button is-danger" onClick={onSubmit}>
				Delete
			</button>
			<button className="button is-light" onClick={close}>
				Cancel
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
