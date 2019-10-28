import React from "react";
import Axios from "axios";

class NewModel extends React.Component {
	state = {
        typeName: ""
	};
	componentDidMount() {
		const { modalType, data } = this.props;
		this.getAllProductTypes();
		if (modalType === "EDIT") {
			this.setState({
				typeName: data.product_type_name,
			});
		}
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevProps !== this.props) {
			if (prevProps.data !== this.props.data) {
				const { modalType, data } = this.props;
				if (modalType === "EDIT") {
					this.setState({
						typeName: data.product_type_name,
					});
				}
			}
		}
	}
	handleSubmit() {
		const { typeName } = this.state;
		const { modalType, data } = this.props;
		Axios.request({
			method: modalType === "EDIT" ? "PUT" : "POST",
			url: modalType === "EDIT" ? `/model/${data.model_code}/edit` : "/model/add",
			data: {
				name: typeName,
			}
		}).then(res => window.location.reload());
	}

	getAllProductTypes = () => {
		Axios.get(`/product-type/get-all`).then(res => {
			this.setState({ productTypes: res.data.rows });
			console.log(res);
		});
	};

	render() {
		const { typeName } = this.state
		const { modalType } = this.props;
		return (
			<div>
				<div className="field">
					<label className="label">Product Type</label>
					<input
						className="input is-fullwidth"
						placeholder="Product Type Name"
						value={typeName}
						onChange={e => this.setState({ typeName: e.target.value })}
					/>
				</div>
				<button className="button" onClick={() => this.handleSubmit()}>
					{modalType === "EDIT" ? "Edit" : "Add"}
				</button>
			</div>
		);
	}
}

export default NewModel;
