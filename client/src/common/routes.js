import React from "react";
import { Router, Switch } from "react-router-dom";
import history from "./history";
import Report from "../modules/report";
import Record from "../modules/record";
import Single from "../modules/single";
import SearchItem from "../modules/searchitem";
import PublicRoute from "./components/route/PublicRoute";
import PageRoute from "./components/route/PageRoute";
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
						<PageRoute path="/search-item" component={SearchItem} title="Search Items"/>
						<PageRoute path="/search-withdrawal" component={SearchWithdrawal} title="Search Withdrawal"/>
						<PageRoute path="/" component={Home} title="Home"/>
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
