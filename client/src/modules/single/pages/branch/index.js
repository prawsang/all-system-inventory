import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/InnerTable";
import ItemsTable from "@/common/tables/items";
import { setPage } from "@/actions/report";
import { connect } from "react-redux";
import { CustomerData } from "../../data";
import DeleteModal from "@/common/components/DeleteModal";
import Edit from "./Edit";
import Axios from "axios";
import history from "@/common/history";

class Branch extends React.Component {
	state = {
		edit: false,
		activeTable: 0, // 0 = items,1 = reserved items
		showDeleteModal: false
	};
	handleDelete() {
		const { data } = this.props;
		const { branch_code, customer_code } = data.row;
		Axios.request({
			method: "DELETE",
			url: `/branch/${branch_code}/delete`
		}).then(res => history.push(`/single/customer/${customer_code}`));
	}
	render() {
		const { data } = this.props;
		const { edit, activeTable, showDeleteModal } = this.state;
		if (data) {
			if (!data.row) return <p>ไม่พบรายการ</p>;
		}
		return (
			<React.Fragment>
				<h3>Branch: {data && data.row.branch_name}</h3>
				<div className="panel">
					{data && (
						<React.Fragment>
							<div className="panel-content no-pb">
								<div>
									<div style={{ float: "right" }}>
										<button
											className="button"
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
													showDeleteModal: true
												})
											}
										>
											Delete
										</button>
									</div>
									<h5 className="no-mt has-mb-10">Branch</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Branch Code:</label>
										<span>{data.row.branch_code}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Address:</label>
										<span>{data.row.address}</span>
									</div>
								</div>
								<hr />
								<CustomerData data={{
									customer_code: data.row.customer_code,
									customer_name: data.row.customer_name
								}} />
							</div>
							<div className="tabs" style={{ paddingLeft: 30 }}>
								<div
									className={`tab-item ${activeTable === 0 ? "is-active" : ""}`}
									onClick={() => {
										this.setState({ activeTable: 0 });
										this.props.setPage(1);
									}}
								>
									Items
								</div>
								<div
									className={`tab-item ${activeTable === 2 ? "is-active" : ""}`}
									onClick={() => {
										this.setState({ activeTable: 2 });
										this.props.setPage(1);
									}}
								>
									Reserved
								</div>
							</div>
							<div>
								<FetchDataFromServer
									className={activeTable === 0 ? "" : "is-hidden"}
									disabled={activeTable !== 0}
									url={data && `/branch/${data.row.branch_code}/items`}
									render={d => (
										<Table
											data={d}
											filters={{
												itemType: true,
												installDate: true,
												returnDate: true
											}}
											table={d => (
												<ItemsTable
													data={d}
													showInstallDate={true}
													showReturnDate={true}
												/>
											)}
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
											className="no-pt"
											title="Items"
										/>
									)}
								/>
								<FetchDataFromServer
									className={activeTable === 2 ? "" : "is-hidden"}
									disabled={activeTable !== 2}
									url={data && `/branch/${data.row.branch_code}/reserved-items`}
									render={d => (
										<Table
											data={d}
											table={d => <ItemsTable data={d} />}
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
											className="no-pt"
											title="Reserved Items"
										/>
									)}
								/>
							</div>
							<Edit
								branch={data.row}
								close={() => this.setState({ edit: false })}
								active={edit}
							/>
							<DeleteModal 
								active={showDeleteModal}
								close={() => this.setState({ showDeleteModal: false })}
								onDelete={() => this.handleDelete()}
							/>
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapDispatchToProps = {
	setPage
};

export default connect(
	null,
	mapDispatchToProps
)(Branch);
