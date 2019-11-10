import React from "react";
import moment from "moment";
import { formatDate } from "@/common/date";
import Td from "@/common/components/Td";

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
							>
								<Td to={`/single/item/${e.serial_no}`}>{e.serial_no}</Td>
								<Td to={`/single/item/${e.serial_no}`}>{e.branch_name} ({e.branch_code})</Td>
								<Td to={`/single/item/${e.serial_no}`}>{e.customer_name} ({e.customer_code})</Td>
								<Td to={`/single/item/${e.serial_no}`}>{formatDate(e.return_by)}</Td>
								<Td to={`/single/item/${e.serial_no}`}>
									{moment(e.return_by).isBefore() ? (
										<span className="is-bold danger">Overdue</span>
									) : (
										<span>No</span>
									)}
								</Td>
							</tr>
						);
					}))}
		</tbody>
	</table>
);

export default Borrowed;
