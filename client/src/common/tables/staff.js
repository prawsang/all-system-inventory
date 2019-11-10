import React from "react";
import Td from "../components/Td";

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
						>
							<Td to={`/single/staff/${e.staff_code}`}>{e.staff_code}</Td>
							<Td to={`/single/staff/${e.staff_code}`}>{e.staff_name}</Td>
                            { showDepartment && <Td to={`/single/staff/${e.staff_code}`}>{e.department_name} ({e.department_code})</Td>}
						</tr>
					)))}
		</tbody>
	</table>
);

export default StaffTable;
