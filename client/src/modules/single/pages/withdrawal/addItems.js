import React from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import history from "@/common/history";

class AddItemsToWithdrawal extends React.Component {
	state = {
		serialNos: [],
		serialNo: ""
	};

	handleAddSerial(e) {
		e.preventDefault();
		this.setState({
			serialNos: [...this.state.serialNos, this.state.serialNo],
			serialNo: ""
		});
	}

	handleSubmit() {
		const { id } = this.props.match.params;
		const { serialNos } = this.state;
		Axios.request({
			method: "PUT",
			url: `/withdrawal/${id}/add-items`,
			data: {
				serial_no: serialNos
			}
		})
			.then(res => history.push(`/single/withdrawal/${id}`))
			
	}

	render() {
		const { id } = this.props.match.params;
		const { serialNos, serialNo } = this.state;
		return (
			<React.Fragment>
				<h3>เพิ่มของลงในใบเบิกหมายเลข {id}</h3>
				<div className="panel">
					<div className="panel-content">
						<label className="label">Serial No.</label>
						<form onSubmit={e => this.handleAddSerial(e)}>
							<div className="field is-flex">
								<input
									value={serialNo}
									onChange={e => this.setState({ serialNo: e.target.value })}
									className="input is-fullwidth"
									placeholder="Serial No."
								/>
								<button className="button has-ml-05" type="submit">
									Add
								</button>
							</div>
						</form>
						<label className="label">Scanned Serial No.</label>
						{serialNos.length > 0 ? (
							serialNos.map((e, i) => (
								<div key={i + e} className="has-mb-05">
									{i + 1}) <span className="is-bold">{e}</span>
									<button
										className="is-danger has-ml-10 button"
										style={{ padding: "5px 10px" }}
										onClick={() =>
											this.setState({
												serialNos: serialNos
													.slice(0, i)
													.concat(
														serialNos.slice(i + 1, serialNos.length)
													)
											})
										}
									>
										<FontAwesomeIcon icon={faTrash} />
									</button>
								</div>
							))
						) : (
							<p className="is-gray-3">ยังไม่ได้ Scan</p>
						)}
						<div className="buttons">
							<button className="button" onClick={() => this.handleSubmit()}>
								ยื่นยันการเพิ่มของ
							</button>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default AddItemsToWithdrawal;
