import React from "react";
import SearchField from "../SearchField";
import { setSelectedObject } from "@/actions/record";
import { connect } from "react-redux";

class SupplierSearch extends React.Component {
	render() {
		const { disabled, setSelectedObject } = this.props;
		return (
			<SearchField
				responsibleFor="selectedSupplier"
				placeholder="Supplier Name"
				searchUrl="/supplier/get-all"
				searchName="supplier_name"
				label="Supplier"
				disabled={disabled}
				listItem={(e,i) => (
					<span
						key={e.supplier_name + i}
						className="list-item is-clickable"
						onClick={() =>
							setSelectedObject({ selectedSupplier: {
								supplier_code: e.supplier_code,
								name: e.supplier_name
							}})
						}
					>
						{e.supplier_name} ({e.supplier_code})
					</span>
				)}
			/>
		);
	}
}

const mapDispatchToProps = {
	setSelectedObject
};

export default connect(
	null,
	mapDispatchToProps
)(SupplierSearch);
