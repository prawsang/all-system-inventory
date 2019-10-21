import React from "react";
import history from "@/common/history";

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
							onClick={event => {
								history.push(`/single/branch/${e.supplier_code}`);
								event.stopPropagation();
							}}
						>
							<td>{e.supplier_code}</td>
							<td>{e.supplier_name}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default SuppliersTable;
