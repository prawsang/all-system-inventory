import React from "react";
import history from "@/common/history";

const JobsTable = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Job Code</td>
				<td>Job Name</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.jobs.length > 0 &&
					data.jobs.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + e.job_code}
							onClick={event => {
								history.push(`/single/job/${e.job_code}`);
								event.stopPropagation();
							}}
						>
							<td>{e.job_code}</td>
							<td>{e.name}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default JobsTable;
