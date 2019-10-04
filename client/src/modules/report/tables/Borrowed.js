import React from "react";
import history from "@/common/history";
import moment from "moment";

const Borrowed = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Serial No.</td>
				<td>Model Name</td>
				<td>Type</td>
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
								<td>{e.model_name}</td>
								<td>{e.model_type}</td>
								<td>{e.return_by}</td>
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
