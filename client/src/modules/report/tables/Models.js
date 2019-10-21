import React from "react";
// import Model from "../modals/Model";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class ModelsTable extends React.Component {
	state = {
		showEdit: false,
		showDeleteConfirm: false,
		selected: { id: "", type: "", name: "" }
	};
	handleDelete() {
		const { selected } = this.state;
		Axios.request({
			method: "DELETE",
			url: `/model/${selected.model_code}`
		}).then(res => window.location.reload());
	}
	render() {
		const { data } = this.props;
		const { showDeleteConfirm } = this.state;
		return (
			<React.Fragment>
				<table className="is-fullwidth is-rounded">
					<thead>
						<tr>
							<td>Model Name</td>
							<td>Type</td>
							{/* <td /> */}
							<td />
						</tr>
					</thead>
					<tbody>
						{data &&
							(data.rows.length > 0 &&
								data.rows.map((e, i) => (
									<tr key={i + e.model_name} className="is-short">
										<td className="has-no-line-break">{e.model_name}</td>
										<td className="is-fullwidth">{e.is_product_type_name}</td>
										{/* <td className="no-pr">
											<button
												className="button"
												onClick={() =>
													this.setState({
														showEdit: true,
														selected: {
															model_code: e.model_code,
															name: e.model_name,
															product_type_name: e.product_type_name,
															weight: e.weight,
															width: e.width,
															height: e.height,
															depth:e.depth
														}
													})
												}
											>
												Edit
											</button>
										</td> */}
										<td>
											<button
												className="button is-danger"
												onClick={() =>
													this.setState({
														showDeleteConfirm: true,
														selected: {
															model_code: e.model_code,
														}
													})
												}
											>
												Delete
											</button>
										</td>
									</tr>
								)))}
					</tbody>
				</table>
				{/* <Modal
					active={showEdit}
					close={() => this.setState({ showEdit: false })}
					title="Edit"
				>
					<Model data={selected} modalType="EDIT" />
				</Modal> */}
				<Modal
					active={showDeleteConfirm}
					close={() => this.setState({ showDeleteConfirm: false })}
					title="Confirm Deletion"
				>
					<p>Are you sure you want to delete?</p>
					<div className="buttons">
						<button className="button is-danger" onClick={() => this.handleDelete()}>
							Delete
						</button>
						<button
							className="button is-light"
							onClick={() => this.setState({ showDeleteConfirm: false })}
						>
							Cancel
						</button>
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

export default ModelsTable;
