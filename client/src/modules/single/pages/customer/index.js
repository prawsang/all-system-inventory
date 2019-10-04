import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/InnerTable";
import { setPage } from "@/actions/report";
import { connect } from "react-redux";
import BranchesTable from "@/common/tables/branches";
import AddBranch from "./AddBranch";
import Edit from "./Edit";

class Customer extends React.Component {
	state = {
		edit: false,
		activeTable: 0, // 0 = branches, 1 = jobs
		showAddBranchModal: false,
		showAddJobModal: false
	};

	showAddModal() {
		const { activeTable } = this.state;
		if (activeTable === 0) {
			this.setState({ showAddBranchModal: true, showAddJobModal: false });
		} else {
			this.setState({ showAddBranchModal: false, showAddJobModal: true });
		}
	}

	hideAddModal() {
		this.setState({ showAddBranchModal: false, showAddJobModal: false });
	}

	render() {
		const { data } = this.props;
		const { edit, activeTable, showAddBranchModal } = this.state;
		if (data) {
			if (!data.customer) return <p>ไม่พบรายการ</p>;
		}
		return (
			<React.Fragment>
				<h3>Customer: {data && data.customer.name}</h3>
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
								</div>
								<div>
									<h5 className="no-mt has-mb-10">Customer</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Customer Code:</label>
										<span>{data.customer.customer_code}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Customer Name:</label>
										<span>{data.customer.name}</span>
									</div>
								</div>
								<hr />
							</div>
							<div
								className="is-flex is-jc-space-between is-ai-flex-start"
								style={{ padding: "0 30px" }}
							>
								<div className="tabs">
									<div
										className={`tab-item ${
											activeTable === 0 ? "is-active" : ""
										}`}
										onClick={() => {
											this.setState({ activeTable: 0 });
											this.props.setPage(1);
										}}
									>
										Branches
									</div>
								</div>
								<button className="button" onClick={() => this.showAddModal()}>
									Add
								</button>
							</div>
							<div>
								<FetchDataFromServer
									className={activeTable === 0 ? "" : "is-hidden"}
									disabled={activeTable !== 0}
									url={
										data && `/customer/${data.customer.customer_code}/branches`
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
												},
												{
													col: "store_type_name",
													name: "Store Type"
												},
												{
													col: "province",
													name: "Province"
												}
											]}
										/>
									)}
								/>
							</div>
							<AddBranch
								customer={data.customer}
								close={() => this.hideAddModal()}
								active={showAddBranchModal}
							/>
							<Edit
								customer={data.customer}
								close={() => this.setState({ edit: false })}
								active={edit}
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
)(Customer);
