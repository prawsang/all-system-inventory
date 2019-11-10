import React from "react";
import { formatDate } from "@/common/date";
import Td from "../components/Td";

const WithdrawalsTable = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Withdrawal ID</td>
				<td>Type</td>
				<td>Status</td>
				<td>Branch</td>
				<td>Customer</td>
				<td>Department</td>
				<td className="has-no-line-break">Staff</td>
				<td>Date</td>
				<td className="has-no-line-break">Install Date</td>
				<td className="has-no-line-break">Return Date</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.rows.length > 0 &&
					data.rows.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={`${i} ${e.withdrawal_id}`}
						>
							<Td to={`/single/withdrawal/${e.withdrawal_id}`} className="has-no-line-break">{e.withdrawal_id}</Td>
							<Td to={`/single/withdrawal/${e.withdrawal_id}`} className="has-no-line-break">{e.withdrawal_type}</Td>
							<Td to={`/single/withdrawal/${e.withdrawal_id}`}>{e.withdrawal_status}</Td>
							<Td to={`/single/withdrawal/${e.withdrawal_id}`} className="has-no-line-break">
								{ e.withdrawal_type !== "TRANSFER" ? `${e.branch_name} (${e.branch_code})` : "-"}
							</Td>
							<Td to={`/single/withdrawal/${e.withdrawal_id}`} className="has-no-line-break">
								{ e.withdrawal_type !== "TRANSFER" ? `${e.customer_name} (${e.customer_code})` : "-"}
							</Td>
							<Td to={`/single/withdrawal/${e.withdrawal_id}`} className="has-no-line-break">
								{ e.withdrawal_type === "TRANSFER" ? `${e.department_name} (${e.department_code})` : "-"}
							</Td>
							<Td to={`/single/withdrawal/${e.withdrawal_id}`} className="has-no-line-break">{e.staff_name}</Td>
							<Td to={`/single/withdrawal/${e.withdrawal_id}`} className="has-no-line-break">{formatDate(e.withdrawal_date)}</Td>
							<Td to={`/single/withdrawal/${e.withdrawal_id}`} className="has-no-line-break">{formatDate(e.install_date)}</Td>
							<Td to={`/single/withdrawal/${e.withdrawal_id}`} className="has-no-line-break">{formatDate(e.return_by)}</Td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default WithdrawalsTable;
