import React from "react";
import Axios from "axios";

class NewModel extends React.Component {
	state = {
		modelCode: "",
		modelName: "",
		weight: 0,
		height: 0,
		width: 0,
		depth: 0,
		productTypes: [],
		selectedProductType: null
	};
	componentDidMount() {
		const { modalType, data } = this.props;
		this.getAllProductTypes();
		if (modalType === "EDIT") {
			this.setState({
				modelCode: data.model_code,
				modelName: data.name,
				width: data.width,
				height: data.height,
				depth: data.depth,
				weight: data.weight,
				selectedProductType: data.product_type_name
			});
		}
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevProps !== this.props) {
			if (prevProps.data !== this.props.data) {
				const { modalType, data } = this.props;
				if (modalType === "EDIT") {
					this.setState({
						modelCode: data.model_code,
						modelName: data.name,
						width: data.width,
						height: data.height,
						depth: data.depth,
						weight: data.weight,
						selectedProductType: data.product_type_name
					});
				}
			}
		}
	}
	handleSubmit() {
		const { modelName, modelCode, width, height, depth, weight, selectedProductType } = this.state;
		const { modalType, data } = this.props;
		Axios.request({
			method: modalType === "EDIT" ? "PUT" : "POST",
			url: modalType === "EDIT" ? `/model/${data.model_code}/edit` : "/model/add",
			data: {
				name: modelName,
				is_product_type_name: selectedProductType,
				model_code: modelCode,
				width,
				height,
				depth,
				weight
			}
		}).then(res => window.location.reload());
	}

	getAllProductTypes = () => {
		Axios.get(`/product-type/get-all`).then(res => {
			this.setState({ productTypes: res.data.rows });
			console.log(res);
		});
	};

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
				<div className="field is-flex">
					<label className="label">Weight (kg)</label>
					<input
						className="input is-fullwidth"
						placeholder="Weight (kg)"
						value={weight}
						type="number"
						onChange={e => this.setState({ weight: e.target.value })}
					/>
				</div>
				<div className="field is-flex">
					<label className="label">Width (cm)</label>
					<input
						className="input is-fullwidth"
						placeholder="Width (cm)"
						value={width}
						type="number"
						onChange={e => this.setState({ width: e.target.value })}
					/>
				</div>
				<div className="field is-flex">
					<label className="label">Height (cm)</label>
					<input
						className="input is-fullwidth"
						placeholder="Height (cm)"
						value={height}
						type="number"
						onChange={e => this.setState({ height: e.target.value })}
					/>
				</div>
				<div className="field is-flex">
					<label className="label">Depth (cm)</label>
					<input
						className="input is-fullwidth"
						placeholder="Depth (cm)"
						value={depth}
						type="number"
						onChange={e => this.setState({ depth: e.target.value })}
					/>
				</div>
				<div className="field">
					<label className="label">Type</label>
					<div className="select">
						<select
							onChange={e => this.setState({ selectedProductType: e.target.value })}
							value={selectedProductType}
						>
							{ productTypes.map ((e, i) => 
								<option value={e.product_type_name} key={i + e.product_type_name}>{e.product_type_name}</option>
								)}
						</select>
					</div>
				</div>
				<button className="button" onClick={() => this.handleSubmit()}>
					{modalType === "EDIT" ? "Edit" : "Add"}
				</button>
			</div>
		);
	}
}

export default NewModel;
