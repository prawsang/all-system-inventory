import React from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

class AddItems extends React.Component {
	state = {
		bulkCode: "",
		pricePerUnit: 0,
		dateIn: null,
		model: "",
		models: [],
		productTypes: [],
		selectedProductTypeName: null,
		remarks: "",
		serialNos: [],
		serialNo: "",
	};

	getModelsOfType = type => {
		if (type !== "") {
			Axios.get(`/model/get-all?type=${type}`).then(res => {
				this.setState({ models: res.data.rows });
				console.log(res);
			});
		}
	};

	getAllProductTypes = () => {
		Axios.get(`/product-type/get-all`).then(res => {
			this.setState({ productTypes: res.data.rows });
			console.log(res);
		});
	};

	handleAddSerial(e) {
		e.preventDefault();
		this.setState({
			serialNos: [...this.state.serialNos, this.state.serialNo],
			serialNo: ""
		});
	}

	handleSubmit() {
		const { model, remarks, serialNos, bulkCode, pricePerUnit, date_in } = this.state;
		Axios.request({
			method: "POST",
			url: "/item/add",
			data: {
				bulk_code: bulkCode,
				price_per_unit: pricePerUnit,
				model_code: model,
				serial_no: serialNos,
				remarks,
				dateIn: date_in
			}
		}).then(res => this.resetPage());
	}

	resetPage() {
		this.setState({
			type: "",
			model: "",
			models: [],
			remarks: "",
			serialNos: [],
			serialNo: ""
		});
	}

	componentDidMount() {
		this.getAllProductTypes();
	}

	render() {
		const {
			type,
			models,
			model,
			productTypes,
			selectedProductTypeName,
			remarks,
			serialNos,
			serialNo,
			bulkCode,
			dateIn,
			pricePerUnit
		} = this.state;

		return (
			<div className="content">
				<h3>รับของเข้า Stock</h3>
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
						<div className="field is-flex is-ai-center">
							<label className="label">Product Type:</label>
							<div className="select no-mb">
								<select
									value={selectedProductTypeName}
									onChange={e => {
										this.setState({ type: e.target.value });
										this.getModelsOfType(e.target.value);
									}}
								>
									<option value="">Select Type</option>
									{ productTypes.map((e,i) => 
										<option value={e.product_type_name} key={e.product_type_name+i}>
											{e.product_type_name}
										</option>
									) }
								</select>
							</div>
						</div>
						<div className="field is-flex is-ai-center">
							<label className="label">Model:</label>
							<div className={`select no-mb ${type === "" && "is-disabled"}`}>
								<select
									value={model}
									onChange={e => this.setState({ model: e.target.value })}
									disabled={type === ""}
								>
									<option value="">เลือกรุ่น</option>
									{models.length > 0 ? (
										models.map((e, i) => (
											<option value={e.model_code} key={e.model_code + i}>
												{e.model_name} ({e.model_code})
											</option>
										))
									) : (
										<option value="" disabled>
											No Models
										</option>
									)}
								</select>
							</div>
						</div>
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
							<p className="is-gray-3">ยังไม่ได้ Scan</p>
						)}
						<button className="button has-mt-10" onClick={() => this.handleSubmit()}>
							ยื่นยันการรับของ
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default AddItems;
