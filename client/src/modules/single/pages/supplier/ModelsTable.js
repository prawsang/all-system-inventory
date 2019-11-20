import React from "react";
// import Model from "../modals/Model";
import Modal from "@/common/components/Modal";
import ModelModal from "./ModelModal";
import Axios from "axios";

class ModelsTable extends React.Component {
	state = {
		showEdit: false,
		showDeleteConfirm: false,
		selected: {}
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
		const { showDeleteConfirm, showEdit, selected } = this.state;
		return (
			<React.Fragment>
				<table className="is-fullwidth is-rounded">
					<thead>
						<tr>
							<td className="has-no-line-break">Model Code</td>
							<td className="has-no-line-break">Model Name</td>
							<td className="has-no-line-break">Type</td>
							<td />
							<td />
						</tr>
					</thead>
					<tbody>
						{data &&
							(data.rows.length > 0 &&
								data.rows.map((e, i) => (
									<tr key={i + e.model_name} className="is-short">
										<td className="has-no-line-break">{e.model_code}</td>
										<td className="has-no-line-break">{e.model_name}</td>
										<td className="is-fullwidth has-no-line-break">{e.is_product_type_name}</td>
										<td className="no-pr">
											<button
												className="button"
												onClick={() =>
													this.setState({
														showEdit: true,
														selected: e
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
														selected: e
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
				<ModelModal 
					active={showEdit} 
					close={() => this.setState({ showEdit: false })} 
					model={selected}
					supplier={{
						supplier_code: selected.from_supplier_code
					}}
					modalType="EDIT"
				/>
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
