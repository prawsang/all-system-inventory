import React from "react";
import history from "@/common/history";

const StaffTable = ({ data, showDepartment }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Staff Code</td>
				<td>Staff Name</td>
                { showDepartment && <td>Works For Department</td>}
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.rows.length > 0 &&
					data.rows.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + e.staff_code}
							onClick={event => {
								history.push(`/single/staff/${e.staff_code}`);
								event.stopPropagation();
							}}
						>
							<td>{e.staff_code}</td>
							<td>{e.staff_name}</td>
                            { showDepartment && <td>{e.department_name} ({e.department_code})</td>}
						</tr>
					)))}
		</tbody>
	</table>
);

export default StaffTable;
