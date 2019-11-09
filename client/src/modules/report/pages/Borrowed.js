import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/Table";
import BorrowedTable from "../tables/Borrowed";

const Borrowed = () => (
	<FetchDataFromServer
		url="/item/lent"
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
						col: "branch_name",
						name: "Branch Name"
					},
					{
						col: "branch_code",
						name: "Branch Code"
					},
					{
						col: "customer_name",
						name: "Customer Name"
					},
					{
						col: "customer_code",
						name: "Customer Code"
					}
				]}
			/>
		)}
	/>
);

export default Borrowed;
