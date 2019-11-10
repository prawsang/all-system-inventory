import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import StaffTable from "@/common/tables/staff";
import Table from "@/common/components/Table";

const Staff = () => (
	<FetchDataFromServer
		url="/staff/get-all"
		render={data => (
			<Table
				data={data}
				table={data => <StaffTable data={data} showDepartment={true}/>}
				title="All Staff"
				columns={[
					{
						col: "staff_code",
						name: "Staff Code"
                    },
                    {
						col: "staff_name",
						name: "Staff Name"
					},
                    {
						col: "department_code",
						name: "Department Code"
					},
                    {
						col: "department_name",
						name: "Department Name"
					}
				]}
			/>
		)}
	/>
);

export default Staff;
