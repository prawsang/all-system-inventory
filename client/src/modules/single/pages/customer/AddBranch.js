import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class AddBranch extends React.Component {
	state = {
		branchCode: "",
		name: "",
		address: "",
	};

	addBranch() {
		const {
			branchCode,
			name,
			address,
		} = this.state;
		const { customer } = this.props;
		Axios.request({
			method: "POST",
			url: "/branch/add",
			data: {
				customer_code: customer.customer_code,
				branch_code: branchCode,
				name,
				address,
			}
		}).then(res => window.location.reload());
	}

	render() {
		const {
			branchCode,
			name,
			address,
		} = this.state;
		const { close, active, customer } = this.props;

		return (
			<Modal active={active} close={close} title="Add New Branch">
				<div className="form">
					<p>
						ลูกค้า: <b>{customer && customer.customer_name}</b>
					</p>
					<div className="field">
						<label className="label">Branch Code</label>
						<input
							className="input is-fullwidth"
							placeholder="Branch Code"
							onChange={e => this.setState({ branchCode: e.target.value })}
							value={branchCode}
						/>
					</div>
					<div className="field">
						<label className="label">Branch Name</label>
						<input
							className="input is-fullwidth"
							placeholder="Branch Name"
							onChange={e => this.setState({ name: e.target.value })}
							value={name}
						/>
					</div>
					<div className="field">
						<label className="label">Address</label>
						<input
							className="input is-fullwidth"
							placeholder="Address"
							onChange={e => this.setState({ address: e.target.value })}
							value={address}
						/>
					</div>
					<div className="buttons">
						<button className="button" onClick={() => this.addBranch()}>
							Add Branch
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

export default AddBranch;
