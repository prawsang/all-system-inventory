import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";
import { connect } from "react-redux";
import { setSelectedObject } from "@/actions/record";
import ProductTypeSearch from "@/modules/record/components/search/ProductTypeSearch"

class EditModel extends React.Component {
	state = {
        model_code: "",
        name: "",
        width: "",
        height: "",
        depth: "",
		weight: "",
		supplier: null
	};

	handleSubmit() {
		const {
            name,
            width,
            height,
            depth,
			weight,
			supplier,
			model_code
		} = this.state;
		const { model, selectedProductType, modalType } = this.props;
		Axios.request({
			method: "PUT",
			url: modalType === "EDIT" ? `/model/${model.model_code}/edit` : `/model/add`,
			data: {
				model_code: model ? model.model_code : model_code,
                name,
                width,
                height,
                depth,
                weight,
                is_product_type_name: selectedProductType.name,
                from_supplier_code: supplier.supplier_code
			}
		}).then(res => window.location.reload());
	}

	componentDidMount() {
		if (this.props.modalType === "EDIT") {
			const { model } = this.props;
			this.setState({
				model_code: model.model_code,
				name: model.model_name,
				width: model.width,
				height: model.height,
				depth: model.depth,
				weight: model.weight
			});
			this.props.setSelectedObject({
				selectedProductType: {
					name: model.is_product_type_name
				}
			})
		}
		const { supplier } = this.props;
		this.setState({ supplier })
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevProps !== this.props) {
			if (prevProps.model !== this.props.model) {
				const { modalType, model } = this.props;
				if (modalType === "EDIT") {
					this.setState({
						model_code: model.model_code,
						name: model.model_name,
						width: model.width,
						height: model.height,
						depth: model.depth,
						weight: model.weight
					});
					this.props.setSelectedObject({
						selectedProductType: {
							name: model.is_product_type_name
						}
					})
				}
			}
		}
	}

	render() {
		const {
			model_code,
            name,
            width,
            height,
            depth,
            weight,
		} = this.state;
		const { close, active, modalType } = this.props;

		return (
			<Modal active={active} close={close} title={modalType === "EDIT" ? "Edit Model" : "Add Model"}>
				<div className="form">
                    <div className={`field ${modalType === "EDIT" && "is-disabled"}`}>
						<label className="label">Model Code</label>
						<input
							className="input is-fullwidth"
							placeholder="Model Code"
							onChange={e => this.setState({ model_code: e.target.value })}
							value={model_code}
						/>
					</div>
					<div className="field">
						<label className="label">Model Name</label>
						<input
							className="input is-fullwidth"
							placeholder="Model Name"
							onChange={e => this.setState({ name: e.target.value })}
                            value={name}
						/>
					</div>
                    <ProductTypeSearch />
					<div className="field">
						<label className="label">Width (mm)</label>
						<input
							className="input is-fullwidth"
							placeholder="Width"
							onChange={e => this.setState({ width: e.target.value })}
                            value={width}
                            type="number"
						/>
					</div>
                    <div className="field">
						<label className="label">Height (mm)</label>
						<input
							className="input is-fullwidth"
							placeholder="Height"
							onChange={e => this.setState({ height: e.target.value })}
                            value={height}
                            type="number"
						/>
					</div>
                    <div className="field">
						<label className="label">Depth (mm)</label>
						<input
							className="input is-fullwidth"
							placeholder="Depth"
							onChange={e => this.setState({ depth: e.target.value })}
                            value={depth}
                            type="number"
						/>
					</div>
                    <div className="field">
						<label className="label">Weight (kg)</label>
						<input
							className="input is-fullwidth"
							placeholder="Weight"
							onChange={e => this.setState({ weight: e.target.value })}
                            value={weight}
                            type="number"
						/>
					</div>
					<div className="buttons">
						<button className="button" onClick={() => this.handleSubmit()}>
							{modalType === "EDIT" ? "Edit" : "Add"}
						</button>
						<button className="button is-light" onClick={close}>
							Cancel
						</button>
					</div>
				</div>
			</Modal>
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
)(EditModel);
