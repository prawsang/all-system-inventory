import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/InnerTable";
import { setPage } from "@/actions/report";
import { connect } from "react-redux";
import StaffTable from "@/common/tables/staff";
import ItemsTable from "@/common/tables/items";
import AddStaff from "./AddStaff";
import DeleteModal from "@/common/components/DeleteModal";
import Edit from "./Edit";
import Axios from "axios";
import history from "@/common/history";

class Department extends React.Component {
	state = {
		edit: false,
		showAddStaffModal: false,
		showDeleteConfirm: false,
		activeTable: 0
	};

	handleDelete() {
		const { data } = this.props;
		const { department_code } = data.row;
		Axios.request({
			method: "DELETE",
			url: `/department/${department_code}/delete`
		}).then(res => history.push("/report/departments"));
	}

	render() {
		const { data } = this.props;
		const { edit, showAddStaffModal, showDeleteConfirm, activeTable } = this.state;
		if (data) {
			if (!data.row) return <p>Not found.</p>;
		}
		return (
			<React.Fragment>
				<h3>Department: {data && data.row.department_name}</h3>
				<div className="panel">
					{data && (
						<React.Fragment>
							<div className="panel-content no-pb">
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
												showDeleteConfirm: true
											})
										}
									>
										Delete
									</button>
								</div>
								<div>
									<h5 className="no-mt has-mb-10">Department</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Department Code:</label>
										<span>{data.row.department_code}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Department Name:</label>
										<span>{data.row.department_name}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Department Phone:</label>
										<span>{data.row.department_phone}</span>
									</div>
								</div>
								<hr />
							</div>
							<div className="is-flex is-jc-space-between">
								<div className="tabs" style={{ paddingLeft: 30 }}>
									<div
										className={`tab-item ${activeTable === 0 ? "is-active" : ""}`}
										onClick={() => {
											this.setState({ activeTable: 0 });
											this.props.setPage(1);
										}}
									>
										Staff
									</div>
									<div
										className={`tab-item ${activeTable === 1 ? "is-active" : ""}`}
										onClick={() => {
											this.setState({ activeTable: 1 });
											this.props.setPage(1);
										}}
									>
										Items
									</div>
								</div>
								<div
									className={`is-flex is-jc-space-between is-ai-flex-start ${activeTable === 0 || "is-hidden"}`}
									style={{ padding: "0 30px 0 30px"}}
								>
									<button className="button" onClick={() => this.setState({ showAddStaffModal: true })}>
										Add
									</button>
								</div>
							</div>
							<div>
								<FetchDataFromServer
									className={activeTable === 0 ? "" : "is-hidden"}
									disabled={activeTable !== 0}
									url={
										data && `/department/${data.row.department_code}/staff`
									}
									render={d => (
										<Table
											data={d}
											table={d => <StaffTable data={d} />}
											title="Staff"
											className="no-pt"
											columns={[
												{
													col: "staff_code",
													name: "Staff Code"
												},
												{
													col: "staff_name",
													name: "Staff Name"
												}
											]}
										/>
									)}
								/>
								<FetchDataFromServer
									className={activeTable === 1 ? "" : "is-hidden"}
									disabled={activeTable !== 1}
									url={data && `/department/${data.row.department_code}/items`}
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
											title="Items"
										/>
									)}
								/>
							</div>
							<AddStaff
								department={data.row}
								close={() => this.setState({ showAddStaffModal: false })}
								active={showAddStaffModal}
							/>
							<Edit
								department={data.row}
								close={() => this.setState({ edit: false })}
								active={edit}
							/>
						</React.Fragment>
					)}
				</div>
				<DeleteModal 
					active={showDeleteConfirm}
					close={() => this.setState({ showDeleteConfirm: false })}
					onDelete={() => this.handleDelete()}
				/>
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
)(Department);
