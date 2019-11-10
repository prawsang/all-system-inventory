import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import DepartmentTable from "@/common/tables/department";
import TableWithNew from "@/common/components/TableWithNew";
import NewDepartment from "../modals/NewDepartment";

const Department = () => (
	<FetchDataFromServer
		url="/department/get-all"
		render={data => (
			<TableWithNew
				data={data}
				table={data => <DepartmentTable data={data}/>}
				newModalContent={data => <NewDepartment />}
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
