import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";
import SearchSelect from "@/common/components/SearchSelect";

class Edititem extends React.Component {
	state = {
		remarks: "",
		isBroken: false,
		selectedBulkCode: null,
		bulks: []
	};

	edit() {
		const { remarks, isBroken, selectedBulkCode } = this.state;
		const { item } = this.props;
		Axios.request({
			method: "PUT",
			url: `/item/${item.serial_no}/edit`,
			data: {
				is_broken: isBroken,
				remarks,
				from_bulk_code: selectedBulkCode
			}
		}).then(res => window.location.reload());
	}

	getAllBulkCodes = () => {
		Axios.get(`/bulk/get-all`).then(res => {
			this.setState({ bulks: res.data.rows });
		})
	}

	componentDidMount() {
		const { item } = this.props;
		this.getAllBulkCodes();
		this.setState({
			remarks: item.remarks,
			isBroken: item.is_broken,
			selectedBulkCode: item.from_bulk_code
		});
	}

	render() {
		const { remarks, isBroken, selectedBulkCode, bulks } = this.state;
		const { close, active } = this.props;

		return (
			<Modal active={active} close={close} title="Edit Item">
				<div className="form">
					<div className="field">
						<label className="label">Bulk Code</label>
						<div className="select">
							<select value={selectedBulkCode} onChange={e => this.setState({ selectedBulkCode: e.target.value })}>
								{ bulks.map((e,i) => (
									<option value={e.bulk_code}>{e.bulk_code}</option>
								))}
							</select>
						</div>
					</div>
					<div className="field">
						<label className="label">Broken</label>
						<div className="select">
							<select value={isBroken} onChange={e => this.setState({ isBroken: e.target.value })}>
								<option value={false}>Not Broken</option>
								<option value={true}>Broken</option>
							</select>
						</div>
					</div>
					<div className="field">
						<label className="label">Remarks</label>
						<textarea
							className="input textarea is-fullwidth"
							placeholder="Remarks"
							onChange={e => this.setState({ remarks: e.target.value })}
							value={remarks}
						/>
					</div>
					<div className="is-flex is-full-width is-jc-flex-end">
						<button className="button" onClick={() => this.edit()}>Confirm</button>
					</div>
				</div>
			</Modal>
		);
	}
}

export default Edititem;
