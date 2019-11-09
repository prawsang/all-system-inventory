import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class EditBranch extends React.Component {
	state = {
		name: "",
		address: "",
	};

	edit() {
		const {
			name,
			address,
		} = this.state;
		const { branch } = this.props;
		Axios.request({
			method: "PUT",
			url: `/branch/${branch.branch_code}/edit`,
			data: {
				name,
				address,
				owner_customer_code: branch.owner_customer_code
			}
		}).then(res => window.location.reload());
	}

	componentDidMount() {
		const { branch } = this.props;
		this.setState({
			name: branch.branch_name,
			address: branch.address,
		});
	}

	render() {
		const {
			name,
			address,
		} = this.state;
		const { close, active } = this.props;

		return (
			<Modal active={active} close={close} title="Edit Branch">
				<div className="form">
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

export default EditBranch;
