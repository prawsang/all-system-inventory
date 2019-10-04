import React from "react";
import Model from "../modals/Model";
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
			url: `/model/${selected.id}`
		}).then(res => window.location.reload());
	}
	render() {
		const { data } = this.props;
		const { showEdit, showDeleteConfirm, selected } = this.state;
		return (
			<React.Fragment>
				<table className="is-fullwidth is-rounded">
					<thead>
						<tr>
							<td>Model Name</td>
							<td>Type</td>
							<td />
							<td />
						</tr>
					</thead>
					<tbody>
						{data &&
							(data.rows.length > 0 &&
								data.rows.map((e, i) => (
									<tr key={i + e.model_name} className="is-short">
										<td className="has-no-line-break">{e.model_name}</td>
										<td className="is-fullwidth">{e.model_type}</td>
										<td className="no-pr">
											<button
												className="button"
												onClick={() =>
													this.setState({
														showEdit: true,
														selected: {
															id: e.model_id,
															name: e.model_name,
															type: e.model_type
														}
													})
												}
											>
												Edit
											</button>
										</td>
										<td>
											<button
												className="button is-danger"
												onClick={() =>
													this.setState({
														showDeleteConfirm: true,
														selected: {
															id: e.model_id,
															name: e.model_name,
															type: e.model_type
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
				<Modal
					active={showEdit}
					close={() => this.setState({ showEdit: false })}
					title="Edit"
				>
					<Model data={selected} modalType="EDIT" />
				</Modal>
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
