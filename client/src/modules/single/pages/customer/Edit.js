import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class EditCustomer extends React.Component {
	state = {
		name: ""
	};

	edit() {
		const { name } = this.state;
		const { customer } = this.props;
		Axios.request({
			method: "PUT",
			url: `/customer/${customer.customer_code}/edit`,
			data: {
				name
			}
		}).then(res => window.location.reload());
	}

	componentDidMount() {
		const { customer } = this.props;
		this.setState({ name: customer.name });
	}

	render() {
		const { name } = this.state;
		const { close, active } = this.props;

		return (
			<Modal active={active} close={close} title="Edit Customer">
				<div className="form">
					<div className="field">
						<label className="label">Customer Name</label>
						<input
							className="input is-fullwidth"
							placeholder="Customer Name"
							onChange={e => this.setState({ name: e.target.value })}
							value={name}
						/>
					</div>
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

export default EditCustomer;
