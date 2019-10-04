import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/Table";
import BorrowedTable from "../tables/Borrowed";

const Borrowed = () => (
	<FetchDataFromServer
		url="/stock/borrowed"
		render={data => (
			<Table
				data={data}
				table={data => <BorrowedTable data={data} />}
				title="ของยืม"
				filters={{
					itemType: true,
					returnDate: true
				}}
				columns={[
					{
						col: "serial_no",
						name: "Serial No."
					},
					{
						col: "model_name",
						name: "Model Name"
					}
				]}
			/>
		)}
	/>
);

export default Borrowed;
