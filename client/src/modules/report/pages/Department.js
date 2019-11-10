import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import DepartmentTable from "@/common/tables/department";
import Table from "@/common/components/Table";

const Department = () => (
	<FetchDataFromServer
		url="/department/get-all"
		render={data => (
			<Table
				data={data}
				table={data => <DepartmentTable data={data}/>}
				title="All Departments"
				columns={[
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

export default Department;
