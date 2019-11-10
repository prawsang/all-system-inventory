import React from "react";
import { Route, Switch } from "react-router-dom";

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
					<Route path="/report/broken" component={Broken} />
					<Route path="/report/lent" component={Borrowed} />
					<Route path="/report/in-stock" component={InStock} />
					<Route path="/report/customers" component={Customers} />
					<Route path="/report/suppliers" component={Suppliers} />
					<Route path="/report/bulks" component={Bulks} />
					<Route path="/report/staff" component={Staff} />
					<Route path="/report/departments" component={Department} />
					<Route path="/report/product-types" component={ProductTypes} />
					<Route path="/report/all-withdrawals" component={AllWithdrawals} />
				</Switch>
			</div>
		);
	}
}

export default Report;
