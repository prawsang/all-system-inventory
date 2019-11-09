import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/InnerTable";
import ModelsTable from "./ModelsTable";
import ModelModal from "./ModelModal";
import DeleteModal from "@/common/components/DeleteModal";
import Edit from "./Edit";
import Axios from "axios";
import history from "@/common/history";

class Supplier extends React.Component {
	state = {
		edit: false,
		showAddModelModal: false,
		showDeleteConfirm: false
	};

	handleDelete() {
		const { data } = this.props;
		const { supplier_code } = data.row;
		Axios.request({
			method: "DELETE",
			url: `/supplier/${supplier_code}/delete`
		}).then(res => history.push("/report/suppliers"));
	}

	render() {
		const { data } = this.props;
		const { edit, showAddModelModal, showDeleteConfirm } = this.state;
		if (data) {
			if (!data.row) return <p>ไม่พบรายการ</p>;
		}
		return (
			<React.Fragment>
				<h3>Supplier: {data && data.row.supplier_name}</h3>
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
									<h5 className="no-mt has-mb-10">Supplier</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Supplier Code:</label>
										<span>{data.row.supplier_code}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Supplier Name:</label>
										<span>{data.row.supplier_name}</span>
									</div>
                                    <div className="has-mb-10">
										<label className="is-bold has-mr-05">Phone:</label>
										<span>{data.row.supplier_phone}</span>
									</div>
                                    <div className="has-mb-10">
										<label className="is-bold has-mr-05">Email:</label>
										<span>{data.row.supplier_email}</span>
									</div>
								</div>
								<hr />
							</div>
							<div
								className="is-flex is-jc-space-between is-ai-flex-start"
								style={{ padding: "0 0 30px 30px" }}
							>
								<button className="button" onClick={() => this.setState({ showAddModelModal: true })}>
									Add
								</button>
							</div>
							<div>
								<FetchDataFromServer
									url={
										data && `/supplier/${data.row.supplier_code}/models`
									}
									render={d => (
										<Table
											data={d}
											table={d => <ModelsTable data={d} />}
											className="no-pt"
                                            title="Models"
                                            filters={{ itemType: true }}
											columns={[
												{
													col: "model_code",
													name: "Model Code"
												},
												{
													col: "model_name",
													name: "Model Name"
												}
											]}
										/>
									)}
								/>
							</div>
							<ModelModal
								supplier={data.row}
								modalType="ADD"
								close={() => this.setState({ showAddModelModal: false })}
								active={showAddModelModal}
							/>
							<Edit
								supplier={data.row}
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

export default Supplier
