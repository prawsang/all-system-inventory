import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Menu from "./Menu";

class Nav extends React.Component {
	state = {
		showUserMenu: false,
		showSidebar: false,
	};
	render() {
		const { showSidebar } = this.state;
		return (
			<React.Fragment>
				<nav>
					<div className="container is-flex is-jc-space-between">
						<div
							className="nav-item is-clickable"
							onClick={() => this.setState({ showSidebar: true })}
						>
							<p>
								<FontAwesomeIcon className="icon" icon={faBars} />
							</p>
						</div>
					</div>
				</nav>
				<Menu active={showSidebar} close={() => this.setState({ showSidebar: false })} />
			</React.Fragment>
		);
	}
}

export default Nav
