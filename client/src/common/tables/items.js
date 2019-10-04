import React from "react";
import history from "@/common/history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import Modal from "@/common/components/Modal";

const removeItemFromWithdrawal = (serialNo, withdrawalId) => {
	Axios.request({
		method: "PUT",
		url: `/withdrawal/${withdrawalId}/remove-items`,
		data: {
			serial_no: [serialNo]
		}
	}).then(res => window.location.reload());
};

const ConfirmModal = ({ active, close, onConfirm, currentSerial }) => (
	<Modal active={active} close={close} title="Confirm">
		<p>
			Are you sure you want to remove item <b>{currentSerial}</b> from this withdrawal?
		</p>
		<div className="buttons no-mb">
			<button className="button is-danger" onClick={onConfirm}>
				Delete
			</button>
			<button className="button is-light" onClick={close}>
				Cancel
			</button>
		</div>
	</Modal>
);

class ItemsTable extends React.Component {
	state = {
		showConfirm: false,
		currentSerial: ""
	};
	render() {
		const { data, showInstallDate, showDelete, withdrawalId, showReturnDate } = this.props;
		const { showConfirm, currentSerial } = this.state;
		return (
			<React.Fragment>
				<table className="is-fullwidth is-rounded">
					<thead>
						<tr>
							<td>Serial Number</td>
							<td>Model Name</td>
							<td>Type</td>
							{showInstallDate && <td>Installation Date</td>}
							{showReturnDate && <td>Return Date</td>}
							{showDelete && <td>Remove</td>}
						</tr>
					</thead>
					<tbody className="is-hoverable">
						{data &&
							(data.rows.length > 0 &&
								data.rows.map((e, i) => (
									<tr
										className={`is-hoverable is-clickable ${showDelete &&
											"is-short"}`}
										key={i + e.serial_no}
										onClick={event => {
											history.push(`/single/item/${e.serial_no}`);
											event.stopPropagation();
										}}
									>
										<td>{e.serial_no}</td>
										<td>{e.model_name}</td>
										<td>{e.model_type}</td>
										{showInstallDate && <td>{e.install_date}</td>}
										{showReturnDate && <td>{e.return_by}</td>}
										{showDelete && (
											<td>
												<button
													className="button is-danger"
													onClick={event => {
														this.setState({
															showConfirm: true,
															currentSerial: e.serial_no
														});
														event.stopPropagation();
													}}
												>
													<FontAwesomeIcon icon={faTrash} />
												</button>
											</td>
										)}
									</tr>
								)))}
					</tbody>
				</table>
				{showDelete && (
					<ConfirmModal
						active={showConfirm}
						close={() => this.setState({ showConfirm: false })}
						currentSerial={currentSerial}
						onConfirm={() => {
							removeItemFromWithdrawal(currentSerial, withdrawalId);
						}}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default ItemsTable;
