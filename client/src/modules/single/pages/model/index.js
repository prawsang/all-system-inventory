import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/InnerTable";
import BulksTable from "@/common/tables/bulks";
import DeleteModal from "@/common/components/DeleteModal";
// import Edit from "./Edit";
import Axios from "axios";
import history from "@/common/history";
import ModelModal from "../supplier/ModelModal";

class Model extends React.Component {
	state = {
		edit: false,
		showDeleteModal: false
	};
	handleDelete() {
		const { data } = this.props;
		const { model_code } = data.row;
		Axios.request({
			method: "DELETE",
			url: `/model/${model_code}/delete`
		}).then(res => history.push(`/single/supplier/${data.row.from_supplier_code}/`));
	}
	render() {
		const { data } = this.props;
		const { edit, showDeleteModal } = this.state;
		if (data) {
			if (!data.row) return <p>ไม่พบรายการ</p>;
		}
		return (
			<React.Fragment>
				<h3>Model: {data && data.row.model_code}</h3>
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
									<h5 className="no-mt has-mb-10">Model</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Model:</label>
										<span>{data.row.model_name}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Product Type:</label>
										<span>{data.row.is_product_type_name}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Width (mm):</label>
										<span>{data.row.width}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Height (mm):</label>
										<span>{data.row.height}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Depth (mm):</label>
										<span>{data.row.depth}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Weight (kg):</label>
										<span>{data.row.weight}</span>
									</div>
								</div>
								<hr/>
								<h5 className="no-mt has-mb-10">Supplier</h5>
								<div className="has-mb-10">
									<label className="is-bold has-mr-05">Supplier Name:</label>
									<span
										className="accent is-clickable"
										onClick={() =>
											history.push(
												`/single/supplier/${
													data.row.from_supplier_code
												}`
											)
										}
									>
										{data.row.supplier_name}
									</span>
								</div>
							</div>
							<hr/>
							<FetchDataFromServer
								url={data && `/model/${data.row.model_code}/bulks`}
								render={d => (
									<Table
										data={d}
										table={d => (
											<BulksTable
												data={d}
											/>
										)}
										columns={[
											{
												col: "bulk_code",
												name: "Bulk Code"
											}
										]}
										className="no-pt"
										title="Bulks"
									/>
								)}
							/>
							<DeleteModal 
								active={showDeleteModal}
								close={() => this.setState({ showDeleteModal: false })}
								onDelete={() => this.handleDelete()}
							/>
							{ data && (
								<ModelModal 
									active={edit} 
									close={() => this.setState({ showEdit: false })} 
									model={{
										model_code: data.row.model_code,
										model_name: data.row.model_name,
										height: data.row.height,
										width: data.row.width,
										depth: data.row.depth,
										weight: data.row.weight,
										is_product_type_name: data.row.is_product_type_name,
									}}
									supplier={{
										supplier_code: data.row.from_supplier_code
									}}
									modalType="EDIT"
								/>
							)}
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}

export default Model
