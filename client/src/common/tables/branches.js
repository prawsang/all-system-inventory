import React from "react";
import history from "@/common/history";

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
							onClick={event => {
								history.push(`/single/branch/${e.branch_code}`);
								event.stopPropagation();
							}}
						>
							<td>{e.branch_code}</td>
							<td>{e.branch_name}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default BranchesTable;
