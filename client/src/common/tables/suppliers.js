import React from "react";
import Td from "../components/Td";

const SuppliersTable = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Supplier Code</td>
				<td>Supplier Name</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.rows.length > 0 &&
					data.rows.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + e.supplier_code}
						>
							<Td to={`/single/supplier/${e.supplier_code}`}>{e.supplier_code}</Td>
							<Td to={`/single/supplier/${e.supplier_code}`}>{e.supplier_name}</Td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default SuppliersTable;
