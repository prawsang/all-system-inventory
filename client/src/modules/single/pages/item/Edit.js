import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class Edititem extends React.Component {
	state = {
		remarks: "",
		is_broken: false,
	};

	getModelsOfType = type => {
		if (type !== "") {
			Axios.get(`/model/type/${type}`).then(res => {
				this.setState({ models: res.data.rows });
			});
		}
	};

	edit() {
		const { remarks, is_broken } = this.state;
		const { item } = this.props;
		Axios.request({
			method: "PUT",
			url: `/stock/${item.serial_no}/edit`,
			data: {
				is_broken,
				remarks,
			}
		}).then(res => window.location.reload());
	}

	componentDidMount() {
		const { item } = this.props;
		this.setState({
			remarks: item.remarks,
		});
		this.getModelsOfType(item.model.type);
	}

	render() {
		const { remarks, is_broken } = this.state;
		const { close, active } = this.props;

		return (
			<Modal active={active} close={close} title="Edit Item">
				<div className="form">
					<div className="field">
						<label className="label">Remarks</label>
						<textarea
							className="input textarea is-fullwidth"
							placeholder="Remarks"
							onChange={e => this.setState({ remarks: e.target.value })}
							value={remarks}
						/>
					</div>
				</div>
			</Modal>
		);
	}
}

export default Edititem;
