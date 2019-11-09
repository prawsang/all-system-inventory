import React from "react";
import { Router, Switch } from "react-router-dom";
import history from "./history";
import Report from "../modules/report";
import Record from "../modules/record";
import Single from "../modules/single";
import SearchItem from "../modules/searchitem";
import PublicRoute from "./components/PublicRoute";
import SearchWithdrawal from "../modules/searchwithdrawal";

class AppRouter extends React.Component {
	render() {
		return (
			<React.Fragment>
				<Router history={history}>
					<Switch>
						<PublicRoute path="/single" component={Single} />
						<PublicRoute path="/record" component={Record} />
						<PublicRoute path="/report" component={Report} />
						<PublicRoute path="/search-item" component={SearchItem} />
						<PublicRoute path="/search-withdrawal" component={SearchWithdrawal} />
						<PublicRoute path="/" component={Home} />
					</Switch>
				</Router>
			</React.Fragment>
		);
	}
}
export default AppRouter;

const Home = () => (
	<div className="content">
		<p className="is-gray-3">Please select a menu.</p>
	</div>
);
