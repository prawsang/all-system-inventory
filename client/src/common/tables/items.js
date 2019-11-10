import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import Modal from "@/common/components/Modal";
import { formatDate } from "@/common/date";
import Td from "../components/Td";

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
		const { data, showInstallDate, showDelete, withdrawalId, showReturnDate, hideDetails } = this.props;
		const { showConfirm, currentSerial } = this.state;
		return (
			<React.Fragment>
				<table className="is-fullwidth is-rounded">
					<thead>
						<tr>
							<td>Serial Number</td>
							{ hideDetails || (
								<td>Model Name</td>
							)}
							{ hideDetails || (
								<td>Product Type</td>
							)}
							<td>Status</td>
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
									>
										<Td to={`/single/item/${e.serial_no}`}>{e.serial_no}</Td>
										{ hideDetails || (
											<Td to={`/single/item/${e.serial_no}`}>{e.model_name}</Td>
										)}
										{ hideDetails || (
											<Td to={`/single/item/${e.serial_no}`}>{e.is_product_type_name}</Td>
										)}
										<Td to={`/single/item/${e.serial_no}`}>{e.status}</Td>
										{showInstallDate && <Td to={`/single/item/${e.serial_no}`}>{e.install_date}</Td>}
										{showReturnDate && <Td to={`/single/item/${e.serial_no}`}>{formatDate(e.return_by)}</Td>}
										{showDelete && (
											<td className="no-link">
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
