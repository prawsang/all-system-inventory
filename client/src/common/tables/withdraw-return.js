import React from "react";
import { formatDate } from "@/common/date";
import moment from "moment";
import { formatDateTime } from "@/common/date";
import Td from "../components/Td";

const WithdrawalsTable = ({ data }) => {
	let d = [...data.withdrawals,...data.returns];
	d = d.sort((a,b) => {
		const ad = a.return_datetime ? a.return_datetime : a.withdrawal_date;
		const bd = b.return_datetime ? b.return_datetime : b.withdrawal_date;
		return  moment(bd) - moment(ad);
	})

	return (
		<table className="is-fullwidth is-rounded">
			<thead>
				<tr>
					<td>Action</td>
					<td>Date</td>
					<td>Withdrawal ID</td>
					<td>Type</td>
					<td>Status</td>
					<td>Branch</td>
					<td>Customer</td>
					<td>Department</td>
					<td className="has-no-line-break">ผู้เบิก</td>
					<td className="has-no-line-break">Install Date</td>
					<td className="has-no-line-break">Return Date</td>
				</tr>
			</thead>
			<tbody className="is-hoverable">
				{data &&
					(d.length > 0 &&
						d.map((e, i) => (
							<tr
								className={e.withdrawal_id ? `is-hoverable is-clickable` : ""}
								key={`${i} ${e.withdrawal_id}`}
							>
								<Td 
									className="has-no-line-break"
									style={{ 
										backgroundColor: e.withdrawal_id ? "rgba(230, 69, 57, 0.5)" : "rgba(77, 194, 82, 0.5)", 
										borderWidth: 1,
										borderColor: "#e64539",
										borderStyle: e.withdrawal_id ? "solid" : "none"
									}}
									to={e.withdrawal_id ? `/single/withdrawal/${e.withdrawal_id}` : null}
								><b>{e.withdrawal_id ? "Withdraw" : "Return"}</b></Td>
								<Td className="has-no-line-break" to={e.withdrawal_id ? `/single/withdrawal/${e.withdrawal_id}` : null}>
									{e.withdrawal_date ? formatDateTime(e.withdrawal_date) : formatDateTime(e.return_datetime)}
								</Td>
								<Td className="has-no-line-break" to={e.withdrawal_id ? `/single/withdrawal/${e.withdrawal_id}` : null}>
									{e.withdrawal_id ? e.withdrawal_id : "-"}
								</Td>
								<Td className="has-no-line-break" to={e.withdrawal_id ? `/single/withdrawal/${e.withdrawal_id}` : null}>
									{e.withdrawal_type ? e.withdrawal_type : "-"}
								</Td>
								<Td to={e.withdrawal_id ? `/single/withdrawal/${e.withdrawal_id}` : null}>
									{e.withdrawal_status ? e.withdrawal_status : "-"}
								</Td>
								<Td className="has-no-line-break" to={e.withdrawal_id ? `/single/withdrawal/${e.withdrawal_id}` : null}>
									{e.withdrawal_type && e.withdrawal_type !== "TRANSFER" ? `${e.branch_name} (${e.branch_code})` : "-"}
								</Td>
								<Td className="has-no-line-break" to={e.withdrawal_id ? `/single/withdrawal/${e.withdrawal_id}` : null}>
									{e.withdrawal_type && e.withdrawal_type !== "TRANSFER" ? `${e.customer_name} (${e.customer_code})` : "-"}
								</Td>
								<Td className="has-no-line-break" to={e.withdrawal_id ? `/single/withdrawal/${e.withdrawal_id}` : null}>
									{e.withdrawal_type && e.withdrawal_type === "TRANSFER" ? `${e.department_name} (${e.department_code})` : "-"}
								</Td>
								<Td className="has-no-line-break" to={e.withdrawal_id ? `/single/withdrawal/${e.withdrawal_id}` : null}>
									{e.staff_name ? e.staff_name : "-"}
								</Td>
								<Td className="has-no-line-break" to={e.withdrawal_id ? `/single/withdrawal/${e.withdrawal_id}` : null}>
									{e.install_date ? formatDate(e.install_date): "-"}
								</Td>
								<Td className="has-no-line-break" to={e.withdrawal_id ? `/single/withdrawal/${e.withdrawal_id}` : null}>
									{e.return_by ? formatDate(e.return_by) : "-"}
								</Td>
							</tr>
						)))}
			</tbody>
		</table>
	)
}


export default WithdrawalsTable;
