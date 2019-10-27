import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";
import { connect } from "react-redux";
import { setSelectedObject } from "@/actions/record";
import BulkSearch from "@/modules/record/components/search/BulkSearch";

class EditItem extends React.Component {
	state = {
		remarks: "",
		isBroken: false,
	};

	edit() {
		const { remarks, isBroken } = this.state;
		const { selectedBulk } = this.props;
		const { item } = this.props;
		Axios.request({
			method: "PUT",
			url: `/item/${item.serial_no}/edit`,
			data: {
				is_broken: isBroken,
				remarks,
				from_bulk_code: selectedBulk.name
			}
		}).then(res => window.location.reload());
	}

	componentDidMount() {
		const { item } = this.props;
		this.props.setSelectedObject({
			selectedBulk: {
				name: item.from_bulk_code
			}
		})
		this.setState({
			remarks: item.remarks,
			isBroken: item.is_broken,
		});
	}

	render() {
		const { remarks, isBroken } = this.state;
		const { close, active } = this.props;

		return (
			<Modal active={active} close={close} title="Edit Item">
				<div className="form">
					<BulkSearch />
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

const mapStateToProps = state => ({
	selectedBulk: state.record.selectedBulk
})

const mapDispatchToProps = {
	setSelectedObject
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditItem);
