import React from "react";
import history from "@/common/history";

const DepartmentsTable = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Department Code</td>
				<td>Department Name</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.rows.length > 0 &&
					data.rows.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + e.department_code}
							onClick={event => {
								history.push(`/single/department/${e.department_code}`);
								event.stopPropagation();
							}}
						>
							<td>{e.department_code}</td>
							<td>{e.department_name}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default DepartmentsTable;
