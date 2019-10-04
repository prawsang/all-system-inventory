import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/Table";
import BrokenTable from "@/common/tables/items";

const Broken = () => (
	<FetchDataFromServer
		url="/item/get-all"
		params="is-broken=true"
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
						col: "product_type_name",
						name: "Product Type"
					}
				]}
			/>
		)}
	/>
);

export default Broken;
