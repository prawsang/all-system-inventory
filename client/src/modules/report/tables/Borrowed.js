import React from "react";
import history from "@/common/history";
import moment from "moment";
import { formatDate } from "@/common/date";

const Borrowed = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Serial No.</td>
				<td>Branch</td>
				<td>Customer</td>
				<td>Return By</td>
				<td>Overdue</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.rows.length > 0 &&
					data.rows.map((e, i) => {
						return (
							<tr
								className="is-hoverable is-clickable"
								key={i + e.serial_no}
								onClick={() => history.push(`/single/item/${e.serial_no}`)}
							>
								<td>{e.serial_no}</td>
								<td>{e.branch_name} ({e.branch_code})</td>
								<td>{e.customer_name} ({e.customer_code})</td>
								<td>{formatDate(e.return_by)}</td>
								<td>
									{moment(e.return_by).isBefore() ? (
										<span className="is-bold danger">Overdue</span>
									) : (
										<span>No</span>
									)}
								</td>
							</tr>
						);
					}))}
		</tbody>
	</table>
);

export default Borrowed;
