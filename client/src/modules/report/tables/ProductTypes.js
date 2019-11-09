import React from "react";
import ProductType from "../modals/ProductType";
import DeleteModal from "@/common/components/DeleteModal";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class ProductTypesTable extends React.Component {
	state = {
		showEdit: false,
		showDeleteConfirm: false,
		selected: { id: "", type: "", name: "" }
	};
	handleDelete() {
		const { selected } = this.state;
		Axios.request({
			method: "DELETE",
			url: `/product-type/${selected.id}`
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
							<td>Product Type Name</td>
							<td />
							<td />
						</tr>
					</thead>
					<tbody>
						{data &&
							(data.rows.length > 0 &&
								data.rows.map((e, i) => (
									<tr key={i + e.product_type_name} className="is-short">
										<td className="has-no-line-break is-fullwidth">{e.product_type_name}</td>
										<td className="no-pr">
											<button
												className="button"
												onClick={() =>
													this.setState({
														showEdit: true,
														selected: {
															product_type_name: e.product_type_name
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
															product_type_name: e.product_type_name
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
					<ProductType data={selected} modalType="EDIT" />
				</Modal>
				<DeleteModal 
					active={showDeleteConfirm}
					close={() => this.setState({ showDeleteConfirm: false })}
					onDelete={() => this.handleDelete()}
				/>
			</React.Fragment>
		);
	}
}

export default ProductTypesTable;
