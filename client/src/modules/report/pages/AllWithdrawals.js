import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/Table";
import WithdrawalsTable from "@/common/tables/withdrawals";

const AllWithdrawals = () => (
	<FetchDataFromServer
		url="/withdrawal/get-all"
		render={data => (
			<Table
				data={data}
				table={data => <WithdrawalsTable data={data} />}
				title="ใบเบิกทั้งหมด"
				filters={{
					date: true,
					returnDate: true,
					installDate: true,
					withdrawalType: true,
					withdrawalStatus: true,
					billed: true
				}}
				columns={[
					{
						col: "do_number",
						name: "DO Number"
					},
					{
						col: "po_number",
						name: "PO Number"
					},
					{
						col: "customer_name",
						name: "Customer Name"
					},
					{
						col: "customer_code",
						name: "Customer Code"
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
						col: "withdrawal_type",
						name: "Type"
					},
					{
						col: "withdrawal_status",
						name: "Status"
					},
					{
						col: "staff_name",
						name: "ผู้เบิก"
					}
				]}
			/>
		)}
	/>
);

export default AllWithdrawals;
