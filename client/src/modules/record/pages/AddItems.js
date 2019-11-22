import React from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import ModelSearch from "../components/search/ModelSearch";
import SupplierSearch from "../components/search/SupplierSearch";
import history from "@/common/history";

class AddItems extends React.Component {
	state = {
		bulkCode: "",
		pricePerUnit: 0,
		dateIn: null,
		remarks: "",
		serialNos: [],
		serialNo: ""
	};

	handleAddSerial(e) {
		e.preventDefault();
		this.setState({
			serialNos: [...this.state.serialNos, this.state.serialNo],
			serialNo: ""
		});
	}

	handleSubmit() {
		const { remarks, serialNos, bulkCode, pricePerUnit, dateIn } = this.state;
		const { selectedModel } = this.props;
		if (!selectedModel) return;
		Axios.request({
			method: "POST",
			url: "/bulk/add",
			data: {
				bulk_code: bulkCode,
				price_per_unit: pricePerUnit,
				of_model_code: selectedModel.model_code,
				serial_no: serialNos,
				remarks,
				date_in: dateIn,
				is_broken: false
			}
		}).then(res => history.push(`/single/bulk/${res.data.rows[0].bulk_code}`));
	}
	render() {
		const {
			remarks,
			serialNos,
			serialNo,
			bulkCode,
			dateIn,
			pricePerUnit
		} = this.state;
		const { selectedSupplier } = this.props;

		return (
			<div className="content">
				<h3>Add Stock</h3>
				<div className="panel">
					<div className="panel-content">
						<div className="field">
							<label className="label">Bulk Code</label>
							<input
								value={bulkCode}
								onChange={e => this.setState({ bulkCode: e.target.value })}
								className="input is-fullwidth"
								placeholder="Bulk Code"
							/>
						</div>
						<div className="field">
							<label className="label">Price Per Unit</label>
							<input
								value={pricePerUnit}
								onChange={e => this.setState({ pricePerUnit: e.target.value })}
								className="input is-fullwidth"
								placeholder="Price Per Unit"
								type="number"
							/>
						</div>
						<div className="field">
							<label className="label">Date In</label>
							<input
								value={dateIn}
								onChange={e => this.setState({ dateIn: e.target.value })}
								className="input is-fullwidth"
								placeholder="Date In"
								type="date"
							/>
						</div>
						<SupplierSearch />
						<ModelSearch disabled={!selectedSupplier}/>
						<div className="field">
							<label className="label">Remarks:</label>
							<textarea
								className="input textarea is-fullwidth"
								placeholder="Remarks"
								value={remarks}
								onChange={e => this.setState({ remarks: e.target.value })}
							/>
						</div>
						<label className="label">Serial No.</label>
						<form onSubmit={e => this.handleAddSerial(e)}>
							<div className="field is-flex">
								<input
									value={serialNo}
									onChange={e => this.setState({ serialNo: e.target.value })}
									className="input is-fullwidth"
									placeholder="Serial No."
								/>
								<button className="button has-ml-05" type="submit">
									Add
								</button>
							</div>
						</form>
						<label className="label">Scanned Serial No.</label>
						{serialNos.length > 0 ? (
							serialNos.map((e, i) => (
								<div key={i + e} className="has-mb-05">
									{i + 1}) <span className="is-bold">{e}</span>
									<button
										className="is-danger has-ml-10 button"
										style={{ padding: "5px 10px" }}
										onClick={() =>
											this.setState({
												serialNos: serialNos
													.slice(0, i)
													.concat(
														serialNos.slice(i + 1, serialNos.length)
													)
											})
										}
									>
										<FontAwesomeIcon icon={faTrash} />
									</button>
								</div>
							))
						) : (
							<p className="is-gray-3">Not Scanned</p>
						)}
						<button className="button has-mt-10" onClick={() => this.handleSubmit()}>
							Confirm
						</button>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	selectedModel: state.record.selectedModel,
	selectedSupplier: state.record.selectedSupplier
});

export default connect(
	mapStateToProps,
	null
)(AddItems);
