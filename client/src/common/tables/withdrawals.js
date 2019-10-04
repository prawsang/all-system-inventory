import React from "react";
import history from "@/common/history";
import { formatDate } from "@/common/date";

const WithdrawalsTable = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Withdrawal ID</td>
				<td>Type</td>
				<td>PO Number</td>
				<td>DO Number</td>
				<td>Branch</td>
				<td>Customer</td>
				<td className="has-no-line-break">ผู้เบิก</td>
				<td>Date</td>
				<td className="has-no-line-break">Install Date</td>
				<td className="has-no-line-break">Return Date</td>
				<td>Status</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.rows.length > 0 &&
					data.rows.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={`${i} ${e.withdrawal_id}`}
							onClick={event => {
								history.push(`/single/withdrawal/${e.withdrawal_id}`);
								event.stopPropagation();
							}}
						>
							<td className="has-no-line-break">{e.withdrawal_id}</td>
							<td className="has-no-line-break">{e.withdrawal_type}</td>
							<td>
								{e.withdrawal_type === "INSTALLATION"
									? e.po_number
										? e.po_number
										: "ยังไม่ได้รับ"
									: "N/A"}
							</td>
							<td>
								{e.withdrawal_type === "INSTALLATION"
									? e.do_number
										? e.do_number
										: "-"
									: "N/A"}
							</td>
							<td className="has-no-line-break">
								{e.branch_name} {e.branch_code && `(${e.branch_code})`}
							</td>
							<td className="has-no-line-break">
								{e.customer_name} ({e.customer_code})
							</td>
							<td className="has-no-line-break">{e.staff_name}</td>
							<td className="has-no-line-break">{formatDate(e.withdrawal_date)}</td>
							<td className="has-no-line-break">{formatDate(e.install_date)}</td>
							<td className="has-no-line-break">{formatDate(e.return_by)}</td>
							<td>{e.withdrawal_status}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default WithdrawalsTable;
