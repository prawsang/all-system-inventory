import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import BulksTable from "@/common/tables/bulks";
import Table from "@/common/components/Table";

const Bulks = () => (
	<FetchDataFromServer
		url="/bulk/get-all"
		render={data => (
			<Table
				data={data}
				table={data => <BulksTable data={data} />}
				title="All Bulks"
                // newModalContent={data => <NewSupplier />}
                filters={{
                    date: true
                }}
				columns={[
					{
						col: "bulk_code",
						name: "Bulk Code"
					}
				]}
			/>
		)}
	/>
);

export default Bulks;
