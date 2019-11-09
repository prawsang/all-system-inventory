import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/InnerTable";
import { setPage } from "@/actions/report";
import { connect } from "react-redux";
import BranchesTable from "@/common/tables/branches";
import AddBranch from "./AddBranch";
import DeleteModal from "@/common/components/DeleteModal";
import Edit from "./Edit";
import Axios from "axios";
import history from "@/common/history";

class Customer extends React.Component {
	state = {
		edit: false,
		showAddBranchModal: false,
		showDeleteConfirm: false
	};

	handleDelete() {
		const { data } = this.props;
		const { customer_code } = data.row;
		Axios.request({
			method: "DELETE",
			url: `/customer/${customer_code}/delete`
		}).then(res => history.push("/report/customers"));
	}

	render() {
		const { data } = this.props;
		const { edit, showAddBranchModal, showDeleteConfirm } = this.state;
		if (data) {
			if (!data.row) return <p>ไม่พบรายการ</p>;
		}
		return (
			<React.Fragment>
				<h3>Customer: {data && data.row.customer_name}</h3>
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
									<h5 className="no-mt has-mb-10">Customer</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Customer Code:</label>
										<span>{data.row.customer_code}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Customer Name:</label>
										<span>{data.row.customer_name}</span>
									</div>
								</div>
								<hr />
							</div>
							<div
								className="is-flex is-jc-space-between is-ai-flex-start"
								style={{ padding: "0 0 30px 30px" }}
							>
								<button className="button" onClick={() => this.setState({ showAddBranchModal: true })}>
									Add
								</button>
							</div>
							<div>
								<FetchDataFromServer
									url={
										data && `/customer/${data.row.customer_code}/branches`
									}
									render={d => (
										<Table
											data={d}
											table={d => <BranchesTable data={d} />}
											className="no-pt"
											title="Branches"
											columns={[
												{
													col: "branch_code",
													name: "Branch Code"
												},
												{
													col: "branch_name",
													name: "Branch Name"
												}
											]}
										/>
									)}
								/>
							</div>
							<AddBranch
								customer={data.row}
								close={() => this.setState({ showAddBranchModal: false })}
								active={showAddBranchModal}
							/>
							<Edit
								customer={data.row}
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
)(Customer);
