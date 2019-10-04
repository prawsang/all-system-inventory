import React from "react";
import { Route, Switch } from "react-router-dom";

import Broken from "./pages/Broken";
import Borrowed from "./pages/Borrowed";
import InStock from "./pages/InStock";
import CustomersTable from "./pages/CustomersTable";
import Models from "./pages/Models";
import AllWithdrawals from "./pages/AllWithdrawals";

class Report extends React.Component {
	render() {
		return (
			<div className="content">
				<Switch>
					<Route path="/report/broken" component={Broken} />
					<Route path="/report/borrowed" component={Borrowed} />
					<Route path="/report/in-stock" component={InStock} />
					<Route path="/report/customers" component={CustomersTable} />
					<Route path="/report/models" component={Models} />
					<Route path="/report/all-withdrawals" component={AllWithdrawals} />
				</Switch>
			</div>
		);
	}
}

export default Report;
