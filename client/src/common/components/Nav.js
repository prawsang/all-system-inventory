import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import Menu from "./Menu";
// import { logOut } from "@/actions/auth";
// import { connect } from "react-redux";
// import history from "@/common/history";

class Nav extends React.Component {
	state = {
		showUserMenu: false,
		showSidebar: false,
		currentUser: null
	};
	componentDidMount() {
		this.setState({
			currentUser: {
				username: localStorage.getItem("username"),
				id: localStorage.getItem("userId")
			}
		});
	}
	render() {
		const { showUserMenu, showSidebar, currentUser } = this.state;
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
						<div className="nav-item is-clickable">
							<p onClick={() => this.setState({ showUserMenu: !showUserMenu })}>
								<FontAwesomeIcon className="icon has-mr-05" icon={faUser} />
								{/* {currentUser ? currentUser.username : ""} */}
								System Admin
								<FontAwesomeIcon
									className="icon has-ml-05"
									icon={showUserMenu ? faAngleUp : faAngleDown}
								/>
							</p>
							<div
								className={`menu dropdown is-right panel ${showUserMenu ||
									"is-hidden"}`}
							>
								{/* <span className="list-item is-clickable">User Info</span> */}
								<span
									className="list-item is-clickable"
									// onClick={() => this.props.logOut(history)}
								>
									Log out
								</span>
							</div>
						</div>
					</div>
				</nav>
				<Menu active={showSidebar} close={() => this.setState({ showSidebar: false })} />
			</React.Fragment>
		);
	}
}

export default Nav;

// const mapStateToProps = state => ({
// 	user: state.auth.user
// });

// export default connect(
// 	mapStateToProps,
// 	{ logOut }
// )(Nav);