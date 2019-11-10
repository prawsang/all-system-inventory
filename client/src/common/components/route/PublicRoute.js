import React from "react";
import { Route, Redirect } from "react-router-dom";
import Nav from "../Nav";
import Error from "../Error";

const PublicRoute = props => {
	let { isAuth, path, component: Component, ...rest } = props;
	return (
		<Route
			{...rest}
			path={path}
			component={props =>
				isAuth ? (
					<Redirect to="/" />
				) : (
					<React.Fragment>
						<Nav />
						<Error />
						<div className="container main with-side-bar">
							<Component {...props} />
						</div>
					</React.Fragment>
				)
			}
		/>
	);
};
export default PublicRoute
