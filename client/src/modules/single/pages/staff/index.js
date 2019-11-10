import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/InnerTable";
import WithdrawalsTable from "@/common/tables/withdrawals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { setPage } from "@/actions/report";
import { connect } from "react-redux";
import DeleteModal from "@/common/components/DeleteModal";
import Edit from "./Edit";
import Axios from "axios";
import history from "@/common/history";

class Staff extends React.Component {
	state = {
		edit: false,
		showDeleteModal: false
	};
	handleDelete() {
		const { data } = this.props;
		const { staff_code } = data.row;
		Axios.request({
			method: "DELETE",
			url: `/staff/${staff_code}/delete`
		}).then(res => history.push("/report/staff"))
	}
	render() {
		const { data } = this.props;
		const { edit, showDeleteModal } = this.state;
		if (data) {
			if (!data.row) return <p>ไม่พบรายการ</p>;
		}
		return (
			<React.Fragment>
				<h3>Staff: {data && data.row.staff_name}</h3>
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
									<h5 className="no-mt has-mb-10">Staff</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Staff Code:</label>
										<span>{data.row.staff_code}</span>
									</div>
								</div>
								<hr />
								<div>
									<h5 className="no-mt has-mb-10">
										Department
										<span
											className="is-clickable accent has-ml-10 is-6"
											onClick={() => history.push(`/single/department/${data.row.department_code}`)}
										>
											<FontAwesomeIcon icon={faExternalLinkAlt} />
										</span>
									</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Department Code:</label>
										<span>{data.row.department_code}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Department Name:</label>
										<span>{data.row.department_name}</span>
									</div>
								</div>
							</div>
							<div>
							<FetchDataFromServer
								url={`/withdrawal/get-all`}
								render={d => (
									<Table
										data={d}
										table={data => <WithdrawalsTable data={data} />}
										title="ใบเบิกทั้งหมด"
										params={data && `staff_code=${data.row.staff_code}`}
										filters={{
											date: true,
											returnDate: true,
											installDate: true,
											withdrawalType: true,
											withdrawalStatus: true,
										}}
										columns={[
											{
												col: "customer_name",
												name: "Customer Name"
											},
											{
												col: "customer_code",
												name: "Customer Code"
											},
											{
												col: "branch_name",
												name: "Branch Name"
											},
											{
												col: "branch_code",
												name: "Branch Code"
											},{
												col: "department_name",
												name: "Department Name"
											},
											{
												col: "department_code",
												name: "Department Code"
											},
											{
												col: "withdrawal_status",
												name: "Status"
											}
										]}
									/>
								)}
							/>
							</div>
							<Edit
								staff={data.row}
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
)(Staff);
