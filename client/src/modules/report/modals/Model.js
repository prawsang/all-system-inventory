import React from "react";
import Axios from "axios";

class NewModel extends React.Component {
	state = {
		modelName: "",
		type: ""
	};
	componentDidMount() {
		const { modalType, data } = this.props;
		if (modalType === "EDIT") {
			this.setState({
				modelName: data.name,
				type: data.type
			});
		}
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevProps !== this.props) {
			if (prevProps.data !== this.props.data) {
				const { modalType, data } = this.props;
				if (modalType === "EDIT") {
					this.setState({
						modelName: data.name,
						type: data.type
					});
				}
			}
		}
	}
	handleSubmit() {
		const { modelName, type } = this.state;
		const { modalType, data } = this.props;
		Axios.request({
			method: modalType === "EDIT" ? "PUT" : "POST",
			url: modalType === "EDIT" ? `/model/${data.id}/edit` : "/model/add",
			data: {
				name: modelName,
				type
			}
		}).then(res => window.location.reload());
	}
	render() {
		const { modelName, type } = this.state;
		const { modalType } = this.props;
		return (
			<div>
				<div className="field">
					<label className="label">Model Name</label>
					<input
						className="input is-fullwidth"
						placeholder="Model Name"
						value={modelName}
						onChange={e => this.setState({ modelName: e.target.value })}
					/>
				</div>
				<div className="field">
					<label className="label">Type</label>
					<div className="select">
						<select
							onChange={e => this.setState({ type: e.target.value })}
							value={type}
						>
							<option value="">Select Type</option>
							<option value="POS">POS</option>
							<option value="KEYBOARD">Keyboard</option>
							<option value="MONITOR">Monitor</option>
							<option value="CASH_DRAWER">Cash Drawer</option>
							<option value="SCANNER">Scanner</option>
							<option value="PRINTER">Printer</option>
						</select>
					</div>
				</div>
				<button className="button" onClick={() => this.handleSubmit()}>
					{modalType === "EDIT" ? "Edit" : "Add"}
				</button>
			</div>
		);
	}
}

export default NewModel;
