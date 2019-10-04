import React from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import CustomerSearch from "../components/search/CustomerSearch";
import BranchSearch from "../components/search/BranchSearch";
import { connect } from "react-redux";
import { resetRecordData } from "@/actions/record";

const RETURN = "RETURN";
const BROKEN = "BROKEN";
const RESERVE = "RESERVE";

class EditItems extends React.Component {
	state = {
		action: RETURN,
		serialNos: [],
		serialNo: "",
		hasBranch: false
	};

	handleAddSerial(e) {
		e.preventDefault();
		this.setState({
			serialNos: [...this.state.serialNos, this.state.serialNo],
			serialNo: ""
		});
	}

	handleSubmit() {
		const { action, serialNos, hasBranch } = this.state;
		const { selectedBranches } = this.props;
		if (action === BROKEN) {
			Axios.request({
				method: "PUT",
				url: "/stock/broken",
				data: {
					serial_no: serialNos,
					broken: true
				}
			}).then(res => this.resetPage());
		} else if (action === RETURN) {
			Axios.request({
				method: "PUT",
				url: "/stock/return",
				data: {
					serial_no: serialNos
				}
			}).then(res => this.resetPage());
		} else if (action === RESERVE) {
			Axios.request({
				method: "PUT",
				url: "/stock/reserve",
				data: {
					serial_no: serialNos,
					reserved_by_branch_code: hasBranch
						? selectedBranches.length !== 0
							? selectedBranches[0].id
							: null
						: null
				}
			}).then(res => this.resetPage());
		}
	}

	componentDidMount() {
		this.props.resetRecordData();
	}
	componentWillUnmount() {
		this.props.resetRecordData();
	}

	resetPage() {
		this.setState({
			action: RETURN,
			serialNos: [],
			serialNo: "",
			hasBranch: false
		});
	}

	render() {
		const { action, serialNos, serialNo, hasBranch } = this.state;
		const { selectedCustomer } = this.props;
		return (
			<div className="content">
				<h3>ปรับปรุงรายการ</h3>
				<div className="panel">
					<div className="panel-content">
						<div className="field is-flex is-ai-center">
							<label className="label">Action: </label>
							<div className="select no-mb">
								<select
									value={action}
									onChange={e => {
										this.setState({ action: e.target.value });
									}}
								>
									<option value={RETURN}>คืนของ</option>
									<option value={RESERVE}>จองของ</option>
									<option value={BROKEN}>เสีย</option>
								</select>
							</div>
						</div>
						{action === RESERVE && (
							<div className="has-mb-10">
								<label className="label" style={{ display: "block" }}>
									ข้อมูลลูกค้าที่จอง
								</label>
								<CustomerSearch />
								<div className="field is-flex is-ai-center">
									<label className="label">มีสาขา</label>
									<input
										className="checkbox"
										type="checkbox"
										checked={hasBranch}
										onChange={() => {
											this.setState({ hasBranch: !hasBranch });
										}}
									/>
								</div>
								<BranchSearch
									disabled={
										!selectedCustomer || !hasBranch
									}
									single={true}
								/>
							</div>
						)}
						<label className="label" style={{ display: "block" }}>
							Serial No.
						</label>
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
						<small className="label" style={{ display: "block" }}>
							Scanned Serial No.
						</small>

						{serialNos.length > 0 ? (
							<div className="has-mt-10">
								{serialNos.map((e, i) => (
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
								))}
							</div>
						) : (
							<p className="is-gray-3">ยังไม่ได้ Scan</p>
						)}
						<button className="button has-mt-10" onClick={() => this.handleSubmit()}>
							ยื่นยันการแก้ไขรายการ
						</button>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	selectedCustomer: state.record.selectedCustomer,
	selectedBranches: state.record.selectedBranches,
	selectedJobCode: state.record.selectedJobCode
});

const mapDispatchToProps = {
	resetRecordData
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditItems);
