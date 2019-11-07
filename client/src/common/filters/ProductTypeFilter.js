import React from "react";
import FilterSearch from "@/modules/record/components/FilterSearch";
import { setFilters } from "@/actions/report";
import { connect } from "react-redux";

class ProductTypeFilter extends React.Component {
	render() {
		const { disabled, setFilters } = this.props;
		return (
			<FilterSearch
				responsibleFor="type"
				placeholder="Product Type Name"
				searchUrl="/product-type/get-all"
				filterName="type"
				frontEnd={true}
				staticDataType="productTypes"
                label="Product Type"
				disabled={disabled}
				listItem={(e,i) => (
					<span
						key={e.product_type_name + i}
						className="list-item is-clickable"
						onClick={() =>
							setFilters({ type: e.product_type_name })
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
	setFilters
};

export default connect(
	null,
	mapDispatchToProps
)(ProductTypeFilter);
