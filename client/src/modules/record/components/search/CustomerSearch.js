import React from "react";
import SearchField from "../SearchField";
import { setSelectedObject } from "@/actions/record";
import { connect } from "react-redux";

class CustomerSearch extends React.Component {
	render() {
		const { disabled, setSelectedObject } = this.props;
		return (
			<SearchField
				responsibleFor="selectedCustomer"
				placeholder="Customer Name"
				searchUrl="/customer/get-all"
				searchName="customer_name"
				label="Customer"
				disabled={disabled}
				listItem={(e,i) => (
					<span
						key={e.customer_name + i}
						className="list-item is-clickable"
						onClick={() =>
							setSelectedObject({ selectedCustomer: {
								customer_code: e.customer_code,
								name: e.customer_name
							}})
						}
					>
						{e.customer_name} ({e.customer_code})
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
)(CustomerSearch);
