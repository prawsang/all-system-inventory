import React from "react";
import { Switch, Route } from "react-router-dom";
import AddItems from "./pages/AddItems";
import EditItems from "./pages/EditItems";
import Withdraw from "./pages/Withdraw";

class Record extends React.Component {
	render() {
		return (
			<Switch>
				<Route path="/record/add-items" component={AddItems} />
				<Route path="/record/edit-items" component={EditItems} />
				<Route path="/record/withdraw-items" component={Withdraw} />
			</Switch>
		);
	}
}

export default Record;
