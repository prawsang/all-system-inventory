import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";
import { connect } from "react-redux"
import ModelSearch from "@/modules/record/components/search/ModelSearch";
import SupplierSearch from "@/modules/record/components/search/SupplierSearch";
import { setSelectedObject } from "@/actions/record";
import moment from "moment";

class EditBulk extends React.Component {
	state = {
		price_per_unit: 0
	};

	edit() {
		const {
			price_per_unit,
		} = this.state;
		const { bulk, selectedModel } = this.props;
		Axios.request({
			method: "PUT",
			url: `/bulk/${bulk.bulk_code}/edit`,
			data: {
				price_per_unit,
				of_model_code: selectedModel.model_code,
				date_in: moment().format()
			}
		}).then(res => window.location.reload());
	}

	componentDidMount() {
		const { bulk, setSelectedObject } = this.props;
		this.setState({
			price_per_unit: bulk.price_per_unit
		});
		setSelectedObject({
			selectedModel: {
				model_code: bulk.of_model_code,
				name: bulk.model_name
			},
			selectedSupplier: {
				supplier_code: bulk.from_supplier_code,
				name: bulk.supplier_name
			}
		})
	}

	render() {
		const {
			price_per_unit
		} = this.state;
		const { close, active } = this.props;

		return (
			<Modal active={active} close={close} title="Edit Bulk">
				<div className="form">
					<div className="field">
						<label className="label">Price Per Unit</label>
						<input
							className="input is-fullwidth"
							placeholder="Price Per Unit"
							type="number"
							onChange={e => this.setState({ price_per_unit: e.target.value })}
							value={price_per_unit}
						/>
					</div>
					<SupplierSearch />
					<ModelSearch />
					<div className="buttons">
						<button className="button" onClick={() => this.edit()}>
							Edit
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
	selectedModel: state.record.selectedModel,
	selectedBulk: state.record.selectedBulk
});

const mapDispatchToProps = {
	setSelectedObject
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditBulk);
