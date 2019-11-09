import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class EditSupplier extends React.Component {
	state = {
		name: "",
		phone: "",
		email: ""
	};

	edit() {
		const { name, phone, email } = this.state;
		const { supplier } = this.props;
		Axios.request({
			method: "PUT",
			url: `/supplier/${supplier.supplier_code}/edit`,
			data: {
				name,
				phone,
				email
			}
		}).then(res => window.location.reload());
	}

	componentDidMount() {
		const { supplier } = this.props;
		this.setState({ name: supplier.supplier_name, phone: supplier.supplier_phone, email: supplier.supplier_email });
	}

	render() {
		const { name, email, phone } = this.state;
		const { close, active } = this.props;

		return (
			<Modal active={active} close={close} title="Edit Supplier">
				<div className="form">
					<div className="field">
						<label className="label">Supplier Name:</label>
						<input
							className="input is-fullwidth"
							placeholder="Supplier Name"
							onChange={e => this.setState({ name: e.target.value })}
							value={name}
						/>
					</div>
					<div className="field">
						<label className="label">Phone:</label>
						<input
							className="input is-fullwidth"
							placeholder="Phone"
							onChange={e => this.setState({ phone: e.target.value })}
							value={phone}
						/>
					</div>
					<div className="field">
						<label className="label">Email:</label>
						<input
							className="input is-fullwidth"
							placeholder="Email"
							onChange={e => this.setState({ email: e.target.value })}
							value={email}
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

export default EditSupplier;
