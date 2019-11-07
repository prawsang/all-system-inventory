import React from "react";
import history from "@/common/history";
import { formatDate } from "@/common/date";
import moment from "moment";

const WithdrawalsTable = ({ data }) => {
	const d = [...data.withdrawals,...data.returns];
	d.sort((a,b) => {
		const ad = a.return_datetime ? a.return_datetime : a.withdrawal_date;
		const bd = b.return_datetime ? b.return_datetime : b.withdrawal_date;
		return moment(ad).isAfter(bd);
	})

	return (
		<table className="is-fullwidth is-rounded">
			<thead>
				<tr>
					<td>Withdrawal ID</td>
					<td className="has-no-line-break">Return Date-time</td>
					<td>Type</td>
					<td>Branch</td>
					<td>Customer</td>
					<td>Department</td>
					<td className="has-no-line-break">ผู้เบิก</td>
					<td>Date</td>
					<td className="has-no-line-break">Install Date</td>
					<td className="has-no-line-break">Return Date</td>
					<td>Status</td>
				</tr>
			</thead>
			<tbody className="is-hoverable">
				{data &&
					(d.length > 0 &&
						d.map((e, i) => (
							<tr
								className="is-hoverable is-clickable"
								key={`${i} ${e.withdrawal_id}`}
								onClick={event => {
									history.push(`/single/withdrawal/${e.withdrawal_id}`);
									event.stopPropagation();
								}}
							>
								<td className="has-no-line-break">{e.withdrawal_id ? e.withdrawal_id : "-"}</td>
								<td className="has-no-line-break">{e.return_datetime ? moment(e.return_datetime).format("D/M/YYYY hh:mm") : "-"}</td>
								<td className="has-no-line-break">{e.withdrawal_type ? e.withdrawal_type : "-"}</td>
								<td className="has-no-line-break">
									{e.withdrawal_type && e.withdrawal_type !== "TRANSFER" ? `${e.branch_name} (${e.branch_code})` : "-"}
								</td>
								<td className="has-no-line-break">
									{e.withdrawal_type && e.withdrawal_type !== "TRANSFER" ? `${e.customer_name} (${e.customer_code})` : "-"}
								</td>
								<td className="has-no-line-break">
									{e.withdrawal_type && e.withdrawal_type === "TRANSFER" ? `${e.department_name} (${e.department_code})` : "-"}
								</td>
								<td className="has-no-line-break">{e.staff_name ? e.staff_name : "-"}</td>
								<td className="has-no-line-break">{e.date ? formatDate(e.date) : "-"}</td>
								<td className="has-no-line-break">{e.install_date ? formatDate(e.install_date): "-"}</td>
								<td className="has-no-line-break">{e.return_by ? formatDate(e.return_by) : "-"}</td>
								<td>{e.withdrawal_status ? e.withdrawal_status : "-"}</td>
							</tr>
						)))}
			</tbody>
		</table>
	)
}


export default WithdrawalsTable;
