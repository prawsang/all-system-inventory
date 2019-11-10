import React from "react";
import { Switch } from "react-router-dom";
import InnerPageRoute from "@/common/components/route/InnerPageRoute";
import Broken from "./pages/Broken";
import Borrowed from "./pages/Borrowed";
import InStock from "./pages/InStock";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import ProductTypes from "./pages/ProductTypes";
import Bulks from "./pages/Bulks";
import Staff from "./pages/Staff";
import Department from "./pages/Department";
import AllWithdrawals from "./pages/AllWithdrawals";

class Report extends React.Component {
	render() {
		return (
			<div className="content">
				<Switch>
					<InnerPageRoute path="/report/broken" component={Broken} title="Broken Items"/>
					<InnerPageRoute path="/report/lent" component={Borrowed} title="Lent Items"/>
					<InnerPageRoute path="/report/in-stock" component={InStock} title="In Stock Items" />
					<InnerPageRoute path="/report/customers" component={Customers} title="All Customers" />
					<InnerPageRoute path="/report/suppliers" component={Suppliers} title="All Suppliers" />
					<InnerPageRoute path="/report/bulks" component={Bulks} title="All Bulks" />
					<InnerPageRoute path="/report/staff" component={Staff} title="All Staff"/>
					<InnerPageRoute path="/report/departments" component={Department} title="Department" />
					<InnerPageRoute path="/report/product-types" component={ProductTypes} title="Product Types" />
					<InnerPageRoute path="/report/all-withdrawals" component={AllWithdrawals} title="All Withdrawals" />
				</Switch>
			</div>
		);
	}
}

export default Report;
