import React from "react";
import Axios from "axios";
import history from "@/common/history";

class NewSupplier extends React.Component {
	state = {
		supplierCode: "",
		supplierName: ""
	};
	handleAdd() {
		const { supplierCode, supplierName } = this.state;
		Axios.request({
			method: "POST",
			url: "/supplier/add",
			data: {
				customer_code: supplierCode,
				name: supplierName
			}
		}).then(res => history.push(`/single/supplier/${supplierCode}`));
	}
	render() {
		const { supplierCode, supplierName } = this.state;
		return (
			<div>
				<div className="field">
					<label className="label">Supplier Code</label>
					<input
						className="input is-fullwidth"
						placeholder="Supplier Code"
						value={supplierCode}
						onChange={e => this.setState({ supplierCode: e.target.value })}
					/>
				</div>
				<div className="field">
					<label className="label">Supplier Name</label>
					<input
						className="input is-fullwidth"
						placeholder="Supplier Name"
						value={supplierName}
						onChange={e => this.setState({ supplierName: e.target.value })}
					/>
				</div>
				<button className="button" onClick={() => this.handleAdd()}>
					Add
				</button>
			</div>
		);
	}
}

export default NewSupplier;
