import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import ModelsTable from "../tables/Models";
import TableWithNew from "@/common/components/TableWithNew";
import Model from "../modals/Model";

const Models = () => (
	<FetchDataFromServer
		url="/model/get-all"
		render={data => (
			<TableWithNew
				data={data}
				table={data => <ModelsTable data={data} />}
				title="All Models"
				newModalContent={data => <Model />}
				filters={{
					itemType: true
				}}
				columns={[
					{
						col: "model_name",
						name: "Model Name"
					}
				]}
			/>
		)}
	/>
);

export default Models;
