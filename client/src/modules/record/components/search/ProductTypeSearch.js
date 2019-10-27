import React from "react";
import SearchField from "../SearchField";
import { setSelectedObject } from "@/actions/record";
import { connect } from "react-redux";

class ProductTypeSearch extends React.Component {
	render() {
		const { disabled, setSelectedObject } = this.props;
		return (
			<SearchField
				responsibleFor="selectedProductType"
				placeholder="Product Type Name"
				searchUrl="/product-type/get-all"
				searchName="product_type_name"
				frontEnd={true}
				label="Product Type"
				disabled={disabled}
				listItem={(e,i) => (
					<span
						key={e.product_type_name + i}
						className="list-item is-clickable"
						onClick={() =>
							setSelectedObject({ selectedProductType: {
								name: e.product_type_name
							}})
						}
					>
						{e.product_type_name}
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
)(ProductTypeSearch);
