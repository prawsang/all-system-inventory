import React from "react";
// import Model from "../modals/Model";
import DeleteModal from "@/common/components/DeleteModal";
import ModelModal from "./ModelModal";
import Axios from "axios";
import history from "@/common/history";
import Td from "@/common/components/Td";

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
						</tr>
					</thead>
					<tbody className="is-hoverable">
						{data &&
							(data.rows.length > 0 &&
								data.rows.map((e, i) => (
									<tr 
										key={i + e.model_name} 
										className="is-hoverable is-clickable"
									>
										<Td to={`/single/model/${e.model_code}`} className="has-no-line-break">{e.model_code}</Td>
										<Td to={`/single/model/${e.model_code}`} className="has-no-line-break">{e.model_name}</Td>
										<Td to={`/single/model/${e.model_code}`} className="is-fullwidth has-no-line-break">{e.is_product_type_name}</Td>
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
				<DeleteModal 
					active={showDeleteConfirm}
					close={() => this.setState({ showDeleteConfirm: false })}
					onDelete={() => this.handleDelete()}
				/>
			</React.Fragment>
		);
	}
}

export default ModelsTable;
