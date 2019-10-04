import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class AddBranch extends React.Component {
	state = {
		branchCode: "",
		name: "",
		address: "",
		province: "",
		storeTypeId: 0,
		storeTypes: [],
		glBranch: "",
		shortCode: ""
	};
	componentDidMount() {
		Axios.get("/store-type/get-all").then(res => this.setState({ storeTypes: res.data.rows }));
	}

	addBranch() {
		const {
			branchCode,
			name,
			address,
			province,
			storeTypeId,
			glBranch,
			shortCode
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
				province,
				store_type_id: storeTypeId,
				gl_branch: glBranch,
				short_code: shortCode
			}
		}).then(res => window.location.reload());
	}

	render() {
		const {
			branchCode,
			name,
			address,
			province,
			storeTypeId,
			storeTypes,
			glBranch,
			shortCode
		} = this.state;
		const { close, active, customer } = this.props;

		return (
			<Modal active={active} close={close} title="Add New Branch">
				<div className="form">
					<p>
						ลูกค้า: <b>{customer && customer.name}</b>
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
					<div className="field">
						<label className="label">Province</label>
						<input
							className="input is-fullwidth"
							placeholder="Province"
							onChange={e => this.setState({ province: e.target.value })}
							value={province}
						/>
					</div>
					<div className="field">
						<label className="label">Store Type</label>
						<div className="select">
							<select
								className="select is-fullwidth "
								onChange={e => this.setState({ storeTypeId: e.target.value })}
								value={storeTypeId}
							>
								{storeTypes.map((e, i) => (
									<option value={e.store_type_id} key={i + e.store_type_id}>
										{e.store_type_name}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="field">
						<label className="label">GL Branch</label>
						<input
							className="input is-fullwidth"
							placeholder="GL Branch"
							onChange={e => this.setState({ glBranch: e.target.value })}
							value={glBranch}
						/>
					</div>
					<div className="field">
						<label className="label">Short Code</label>
						<input
							className="input is-fullwidth"
							placeholder="Short Code"
							onChange={e => this.setState({ shortCode: e.target.value })}
							value={shortCode}
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
