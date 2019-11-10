import React from "react";
import Td from "../components/Td";

const BranchesTable = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Branch Code</td>
				<td>Branch Name</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.rows.length > 0 &&
					data.rows.map((e, i) => (
							<tr
								className="is-hoverable is-clickable"
								key={i + e.branch_code}
							>
								<Td to={`/single/branch/${e.branch_code}`}>{e.branch_code}</Td>
								<Td to={`/single/branch/${e.branch_code}`}>{e.branch_name}</Td>
							</tr>
					)))}
		</tbody>
	</table>
);

export default BranchesTable;
