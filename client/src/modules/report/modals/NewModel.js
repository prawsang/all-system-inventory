import React from "react";
import Axios from "axios";
import ProductTypeSearch from "@/modules/record/components/search/ProductTypeSearch"
import { setSelectedObject } from "@/actions/record";
import { connect } from "react-redux";

class ModelModal extends React.Component {
	state = {
		modelCode: "",
		modelName: "",
		weight: 0,
		height: 0,
		width: 0,
		depth: 0,
		productTypes: [],
	};
	handleSubmit() {
		const { modelName, modelCode, width, height, depth, weight } = this.state;
		const { modalType, data, selectedProductType } = this.props;
		Axios.request({
			method: modalType === "EDIT" ? "PUT" : "POST",
			url: modalType === "EDIT" ? `/model/${data.model_code}/edit` : "/model/add",
			data: {
				name: modelName,
				is_product_type_name: selectedProductType.type_name,
				model_code: modelCode,
				width,
				height,
				depth,
				weight
			}
		}).then(res => window.location.reload());
	}

	render() {
		const { modelName, modelCode, width, height, depth, weight, selectedProductType, productTypes } = this.state
		const { modalType } = this.props;
		return (
			<div>
				<div className={`field ${ modalType === "EDIT" ? "is-disabled" : "" }`}>
					<label className="label">Model Code</label>
					<input
						className="input is-fullwidth"
						placeholder="Model Code"
						value={modelCode}
						onChange={e => this.setState({ modelCode: e.target.value })}
					/>
				</div>
				<div className="field">
					<label className="label">Model Name</label>
					<input
						className="input is-fullwidth"
						placeholder="Model Name"
						value={modelName}
						onChange={e => this.setState({ modelName: e.target.value })}
					/>
				</div>
				<div className="field is-flex is-ai-center">
					<label className="label has-no-line-break">Weight (kg)</label>
					<input
						className="input is-fullwidth"
						placeholder="Weight (kg)"
						value={weight}
						type="number"
						onChange={e => this.setState({ weight: e.target.value })}
					/>
				</div>
				<div className="field is-flex is-ai-center">
					<label className="label has-no-line-break">Width (cm)</label>
					<input
						className="input is-fullwidth"
						placeholder="Width (cm)"
						value={width}
						type="number"
						onChange={e => this.setState({ width: e.target.value })}
					/>
				</div>
				<div className="field is-flex is-ai-center">
					<label className="label has-no-line-break">Height (cm)</label>
					<input
						className="input is-fullwidth"
						placeholder="Height (cm)"
						value={height}
						type="number"
						onChange={e => this.setState({ height: e.target.value })}
					/>
				</div>
				<div className="field is-flex is-ai-center">
					<label className="label has-no-line-break">Depth (cm)</label>
					<input
						className="input is-fullwidth"
						placeholder="Depth (cm)"
						value={depth}
						type="number"
						onChange={e => this.setState({ depth: e.target.value })}
					/>
				</div>
				<div className="field">
					<ProductTypeSearch />
				</div>
				<button className="button" onClick={() => this.handleSubmit()}>
					{modalType === "EDIT" ? "Edit" : "Add"}
				</button>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	selectedProductType: state.record.selectedProductType
})
const mapDispatchToProps = {
	setSelectedObject
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ModelModal);
