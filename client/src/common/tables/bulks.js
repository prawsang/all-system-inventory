import React from "react";
import { formatDate } from "../date";
import Td from "../components/Td";

const BulksTable = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Bulk Code</td>
				<td>Model</td>
				<td>Supplier</td>
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
						>
							<Td to={`/single/bulk/${e.bulk_code}`}>{e.bulk_code}</Td>
							<Td to={`/single/bulk/${e.bulk_code}`}>{e.model_name}</Td>
							<Td to={`/single/bulk/${e.bulk_code}`}>{e.supplier_name}</Td>
                            <Td to={`/single/bulk/${e.bulk_code}`}>{formatDate(e.date_in)}</Td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default BulksTable;
