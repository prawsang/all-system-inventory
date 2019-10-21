import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import ProductTypesTable from "../tables/ProductTypes";
import TableWithNew from "@/common/components/TableWithNew";
import ProductType from "../modals/ProductType";

const ProductTypes = () => (
	<FetchDataFromServer
		url="/product-type/get-all"
		render={data => (
			<TableWithNew
				data={data}
				table={data => <ProductTypesTable data={data} />}
				title="All Product Types"
				newModalContent={data => <ProductType />}
				columns={[
					{
						col: "product_type_name",
						name: "Product Type Name"
					}
				]}
			/>
		)}
	/>
);

export default ProductTypes;
