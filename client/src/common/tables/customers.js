import React from "react";
import Td from "../components/Td";

const CustomersTable = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Customer Code</td>
				<td>Customer Name</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.rows.length > 0 &&
					data.rows.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + e.customer_code}
						>
							<Td to={`/single/customer/${e.customer_code}`}>{e.customer_code}</Td>
							<Td to={`/single/customer/${e.customer_code}`}>{e.customer_name}</Td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default CustomersTable;
