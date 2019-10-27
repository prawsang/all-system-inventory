import React from "react";
import history from "@/common/history";
import { formatDate } from "../date";

const BulksTable = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Bulk Code</td>
				<td>Price Per Unit</td>
                <td>Date In</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.rows.length > 0 &&
					data.rows.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + e.bulk_code}
							onClick={event => {
								history.push(`/single/bulk/${e.bulk_code}`);
								event.stopPropagation();
							}}
						>
							<td>{e.bulk_code}</td>
							<td>{e.price_per_unit}</td>
                            <td>{formatDate(e.date_in)}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default BulksTable;
