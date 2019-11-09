import React from "react";
import Table from "@/common/components/InnerTable";
import WithdrawalsTable from "@/common/tables/withdraw-return";
import history from "@/common/history";
import DeleteModal from "@/common/components/DeleteModal";
import Edit from "./Edit";
import Axios from "axios";
import { formatDateTime } from "@/common/date";

class Item extends React.Component {
	state = {
		edit: false,
		showDeleteConfirm: false
	};
	handleDelete() {
		const { data } = this.props;
		const { serial_no, from_bulk_code } = data.row;
		Axios.request({
			method: "DELETE",
			url: `/item/${serial_no}/delete`
		}).then(res => history.push(`/single/bulk/${from_bulk_code}`));
	}
	render() {
		const { data } = this.props;
		const { edit, showDeleteConfirm } = this.state;
		if (data) {
			if (!data.row) return <p>ไม่พบรายการ</p>;
		}
		return (
			<React.Fragment>
				<h3>Item: {data && data.row.serial_no}</h3>
				<div className="panel">
					{data && (
						<React.Fragment>
							<div className="panel-content no-pb">
								<div>
									<div className="is-flex is-ai-center" style={{ float: "right" }}>
										<button
											className="button no-mb"
											onClick={() =>
												this.setState({
													edit: true
												})
											}
										>
											Edit
										</button>
										<button
											className="button is-danger"
											onClick={() =>
												this.setState({
													showDeleteConfirm: true
												})
											}
										>
											Delete
										</button>
									</div>
									<h5 className="no-mt has-mb-10">Item</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Status:</label>
										<span>{data.row.status}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Bulk Code:</label>
										<span
											className="accent is-clickable"
											onClick={() =>
												history.push(
													`/single/bulk/${
														data.row.from_bulk_code
													}`
												)
											}
										>
											{data.row.from_bulk_code}
										</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Model Name:</label>
										<span
											className="accent is-clickable"
											onClick={() =>
												history.push(
													`/single/model/${
														data.row.of_model_code
													}`
												)
											}
										>
											{data.row.model_name}
										</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Date In:</label>
										<span>{formatDateTime(data.row.date_in)}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Price Per Unit:</label>
										<span>{data.row.price_per_unit}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Product Type:</label>
										<span>{data.row.is_product_type_name}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Broken?</label>
										<span>
											{data.row.is_broken ? (
												<span className="danger is-bold">Broken</span>
											) : (
												"Not Broken"
											)}
										</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Remarks:</label>
										<span>{data.row.remarks}</span>
									</div>
								</div>
								<hr />
								<div>
									<h5 className="no-mt has-mb-10">Reserved By</h5>
									{data.row.reserved_branch_code && (
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Branch:</label>
											<span
												className="accent is-clickable"
												onClick={() =>
													history.push(
														`/single/branch/${
															data.row.branch_code
														}`
													)
												}
											>
												{data.row.branch_name}{" "}
												({data.row.branch_code})
											</span>
										</div>
									)}
									{!data.row.reserved_branch_code && (
										<span>This item is not reserved.</span>
									)}
								</div>
								<hr />
							</div>
							<Table
								data={data}
								table={data => <WithdrawalsTable data={data} />}
								className="no-pt"
								title="ประวัติการเบิก/คืน"
								noPage={true}
							/>
							<Edit
								item={data.row}
								close={() => this.setState({ edit: false })}
								active={edit}
							/>
							<DeleteModal 
								active={showDeleteConfirm}
								close={() => this.setState({ showDeleteConfirm: false })}
								onDelete={() => this.handleDelete()}
							/>
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}

export default Item;
