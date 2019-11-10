import React from "react";
import { Route } from "react-router-dom";
import Page from "../Page";

const InnerPageRoute = props => {
	let { isAuth, path, component: Component, title, ...rest } = props;
	return (
		<Route
			{...rest}
			path={path}
			component={props =>
                <Page title={title}>
                    <Component {...props} />
                </Page>
			}
		/>
	);
};
export default InnerPageRoute
