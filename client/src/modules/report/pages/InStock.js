import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/Table";
import ItemsTable from "@/common/tables/items";

class InStock extends React.Component {
	state = {
		type: "ALL"
	};
	render() {
		const { type } = this.state;
		return (
			<FetchDataFromServer
				url="/item/get-all"
				params={`${type === "ALL" ? "" : `type=${type}`}&status=in_stock`}
				render={data => (
					<Table
						data={data}
						table={data => <ItemsTable data={data} />}
						title="In Stock Items"
						filters={{
							itemType: true,
							broken: true
						}}
						columns={[
							{
								col: "serial_no",
								name: "Serial No."
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
	}
}

export default InStock;
