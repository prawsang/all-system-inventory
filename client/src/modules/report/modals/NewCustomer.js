import React from "react";
import Axios from "axios";
import history from "@/common/history";

class NewCustomer extends React.Component {
	state = {
		customerCode: "",
		customerName: ""
	};
	handleAdd() {
		const { customerCode, customerName } = this.state;
		Axios.request({
			method: "POST",
			url: "/customer/add",
			data: {
				customer_code: customerCode,
				name: customerName
			}
		}).then(res => history.push(`/single/customer/${customerCode}`));
	}
	render() {
		const { customerCode, customerName } = this.state;
		return (
			<div>
				<div className="field">
					<label className="label">Customer Code</label>
					<input
						className="input is-fullwidth"
						placeholder="Customer Code"
						value={customerCode}
						onChange={e => this.setState({ customerCode: e.target.value })}
					/>
				</div>
				<div className="field">
					<label className="label">Customer Name</label>
					<input
						className="input is-fullwidth"
						placeholder="Customer Name"
						value={customerName}
						onChange={e => this.setState({ customerName: e.target.value })}
					/>
				</div>
				<button className="button" onClick={() => this.handleAdd()}>
					Add
				</button>
			</div>
		);
	}
}

export default NewCustomer;
