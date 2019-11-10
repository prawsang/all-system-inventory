import React from "react";
import PublicRoute from "./PublicRoute";
import Page from "../Page";

const PageRoute = props => {
	let { isAuth, path, component: Component, title, ...rest } = props;
	return (
		<PublicRoute
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
export default PageRoute
