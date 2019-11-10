import React from "react";
import Td from "../components/Td";

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
						>
							<Td to={`/single/department/${e.department_code}`}>{e.department_code}</Td>
							<Td to={`/single/department/${e.department_code}`}>{e.department_name}</Td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default DepartmentsTable;
