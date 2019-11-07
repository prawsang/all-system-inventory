import React from "react";
import SearchField from "../SearchField";
import { setSelectedObject } from "@/actions/record";
import { connect } from "react-redux";

class ModelSearch extends React.Component {
	render() {
		const { disabled, setSelectedObject,selectedSupplier } = this.props;
		return (
			<SearchField
				responsibleFor="selectedModel"
				placeholder="Model Name"
				searchUrl={selectedSupplier ? `/supplier/${selectedSupplier.supplier_code}/models` : ""}
				searchName="model_name"
				label="Model"
				disabled={disabled || !selectedSupplier}
				listItem={(e,i) => (
					<span
						key={e.model_name + i}
						className="list-item is-clickable"
						onClick={() =>
							setSelectedObject({ selectedModel: {
								model_code: e.model_code,
								name: e.model_name
							}})
						}
					>
						{e.model_name} ({e.model_code})
					</span>
				)}
			/>
		);
	}
}

const mapStateToProps = state => ({
	selectedSupplier: state.record.selectedSupplier
})

const mapDispatchToProps = {
	setSelectedObject
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ModelSearch);
