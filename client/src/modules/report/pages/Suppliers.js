import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import SuppliersTable from "@/common/tables/supplier";
import TableWithNew from "@/common/components/TableWithNew";
import NewSupplier from "../modals/NewSupplier";

const Suppliers = () => (
	<FetchDataFromServer
		url="/supplier/get-all"
		render={data => (
			<TableWithNew
				data={data}
				table={data => <SuppliersTable data={data} />}
				title="All Suppliers"
				newModalContent={data => <NewSupplier />}
				columns={[
					{
						col: "supplier_name",
						name: "Supplier Name"
					},{
                        col: "supplier_code",
                        name: "Supplier Code"
                    }
				]}
			/>
		)}
	/>
);

export default Suppliers;
