import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/Table";
import BrokenTable from "@/common/tables/items";

const Broken = () => (
	<FetchDataFromServer
		url="/stock/get-all"
		params="broken=true"
		render={data => (
			<Table
				data={data}
				table={data => <BrokenTable data={data} />}
				title="ของเสีย"
				filters={{
					itemType: true
				}}
				columns={[
					{
						col: "serial_no",
						name: "Serial No"
					},
					{
						col: "model_name",
						name: "Model Name"
					},
					{
						col: "model_type",
						name: "Model Type"
					}
				]}
			/>
		)}
	/>
);

export default Broken;
