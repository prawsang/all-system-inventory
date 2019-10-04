import React from "react";
import Axios from "axios";
import Modal from "@/common/components/Modal";

class RemarksModal extends React.Component {
	state = {
		remarks: ""
	};
	componentDidMount() {
		const { data } = this.props;
		this.setState({
			remarks: data.remarks ? data.remarks : ""
		});
	}
	editRemarks() {
		const { data } = this.props;
		const { remarks } = this.state;
		Axios.request({
			method: "PUT",
			url: `/withdrawal/${data.id}/edit-remarks`,
			data: {
				remarks
			}
		})
			.then(res => window.location.reload())
			
	}
	render() {
		const { active, close } = this.props;
		const { remarks } = this.state;
		return (
			<Modal active={active} close={close} title="Edit Remarks">
				<div className="field">
					<label className="label">Remarks</label>
					<textarea
						className="input textarea is-fullwidth"
						onChange={e => this.setState({ remarks: e.target.value })}
						value={remarks}
						placeholder="Remarks"
					/>
				</div>
				<div className="buttons">
					<button className="button" onClick={() => this.editRemarks()}>
						Edit
					</button>
					<button className="button is-light" onClick={close}>
						Cancel
					</button>
				</div>
			</Modal>
		);
	}
}

export default RemarksModal;
