import React from "react";
import TableWithNew from "@/common/components/TableWithNew";
import CustomersTable from "@/common/tables/customers";
import NewCustomer from "../modals/NewCustomer";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";

const Customers = () => (
	<FetchDataFromServer
		url="/customer/get-all"
		render={data => (
			<TableWithNew
				data={data}
				table={data => <CustomersTable data={data} />}
				title="All Customers"
				newModalContent={data => <NewCustomer />}
				columns={[
					{
						col: "customer_code",
						name: "Customer Code"
					},
					{
						col: "customer_name",
						name: "Customer Name"
					}
				]}
			/>
		)}
	/>
);

export default Customers;
