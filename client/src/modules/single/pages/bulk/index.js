import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/InnerTable";
import ItemsTable from "@/common/tables/items";
import { setPage } from "@/actions/report";
import { connect } from "react-redux";
import DeleteModal from "@/common/components/DeleteModal";
import Edit from "./Edit";
import Axios from "axios";
import history from "@/common/history";
import { formatDateTime } from "@/common/date"
import { Link } from "react-router-dom";

class Bulk extends React.Component {
	state = {
		edit: false,
		showDeleteModal: false
	};
	handleDelete() {
		const { data } = this.props;
		const { bulk_code } = data.row;
		Axios.request({
			method: "DELETE",
			url: `/bulk/${bulk_code}/delete`
		}).then(res => history.push("/report/bulks"));
	}
	render() {
		const { data } = this.props;
		const { edit, showDeleteModal } = this.state;
		if (data) {
			if (!data.row) return <p>ไม่พบรายการ</p>;
		}
		return (
			<React.Fragment>
				<h3>Bulk: {data && data.row.bulk_code}</h3>
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
									<h5 className="no-mt has-mb-10">Bulk</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Date In:</label>
										<span>{formatDateTime(data.row.date_in)}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Price Per Unit:</label>
										<span>{data.row.price_per_unit}</span>
									</div>
								</div>
								<hr />
								<h5 className="no-mt has-mb-10">Model</h5>
								<div className="has-mb-10">
									<label className="is-bold has-mr-05">Model Name:</label>
									<Link
										className="accent is-clickable"
										to={
												`/single/model/${
													data.row.of_model_code
												}`
										}
									>
										{data.row.model_name}
									</Link>
								</div>
								<hr/>
								<h5 className="no-mt has-mb-10">Supplier</h5>
								<div className="has-mb-10">
									<label className="is-bold has-mr-05">Supplier Name:</label>
									<Link
										className="accent is-clickable"
										to={
											`/single/supplier/${
												data.row.from_supplier_code
											}`
										}
									>{data.row.supplier_name}</Link>
								</div>
							</div>
							<hr/>
							<div className="panel-content no-pt">
								<Link to={`/single/bulk/${data.row.bulk_code}/add-items`}>
									<button
										className="button mr"
									>
										Add Items
									</button>
								</Link>
							</div>
							<FetchDataFromServer
								url={data && `/bulk/${data.row.bulk_code}/items`}
								render={d => (
									<Table
										data={d}
										table={d => (
											<ItemsTable
												data={d}
												showInstallDate={false}
												showReturnDate={false}
												hideDetails={true}
											/>
										)}
										columns={[
											{
												col: "serial_no",
												name: "Serial No."
											}
										]}
										className="no-pt"
										title="Items"
									/>
								)}
							/>
							<Edit
								bulk={data.row}
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
)(Bulk);
