import React from "react";
import { Switch } from "react-router-dom";
import AddItems from "./pages/AddItems";
import EditItems from "./pages/EditItems";
import Withdraw from "./pages/Withdraw";
import InnerPageRoute from "@/common/components/route/InnerPageRoute";

class Record extends React.Component {
	render() {
		return (
			<Switch>
				<InnerPageRoute path="/record/add-items" component={AddItems} title="Add Items To Stock"/>
				<InnerPageRoute path="/record/edit-items" component={EditItems} title="Edit Items"/>
				<InnerPageRoute path="/record/withdraw-items" component={Withdraw} title="Withdraw"/>
			</Switch>
		);
	}
}

export default Record;
