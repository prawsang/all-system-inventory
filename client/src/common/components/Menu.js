import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTable,
	faListUl,
	faArrowAltCircleUp,
	faArrowAltCircleDown,
	faEdit,
	faAngleLeft,
	faAngleRight,
	faTimes,
	faSearch
} from "@fortawesome/free-solid-svg-icons";
import { Link as RouterLink } from "react-router-dom";
// import logo from "@/assets/logo.png";

class Menu extends React.Component {
	state = {
		showReportMenu: false,
		showEditMenu: false,
		showSearchMenu: false
	};
	render() {
		const { showReportMenu, showEditMenu, showSearchMenu } = this.state;
		const { active, close } = this.props;
		return (
			<div className={`side-bar ${active && "is-active"}`}>
				<button
					className="button is-light has-mt-10 has-ml-10 is-hidden-desktop"
					onClick={close}
				>
					<FontAwesomeIcon icon={faTimes} />
				</button>
				<div className="side-bar-head is-ta-center">
					{/* <img
						src={logo}
						alt="logo"
						// className="is-hidden-mobile"
						style={{
							width: 70,
							height: "auto",
							display: "block",
							margin: "auto",
							marginBottom: 10
						}}
					/> */}
					<small className="is-6 is-bold">All System Inventory</small>
				</div>
				<ul className="side-bar-menu">
					<li
						className="side-bar-menu-item is-clickable"
						onClick={e =>
							this.setState({
								showSearchMenu: !showSearchMenu,
								showEditMenu: false,
								showReportMenu: false
							})
						}
					>
						<div className="is-flex is-jc-space-between">
							<div>
								<FontAwesomeIcon className="icon has-mr-05" icon={faSearch} />
								Search
							</div>
							<FontAwesomeIcon
								className="icon has-mr-05"
								icon={showSearchMenu ? faAngleLeft : faAngleRight}
							/>
						</div>
						<ul className={`panel menu dropright ${showSearchMenu || "is-hidden"}`}>
							<Link link="/search-item">Search Items</Link>
							<Link link="/search-withdrawal">Search Withdrawals</Link>
						</ul>
					</li>
					<li
						className="side-bar-menu-item is-clickable"
						onClick={e =>
							this.setState({
								showReportMenu: !showReportMenu,
								showEditMenu: false,
								showSearchMenu: false
							})
						}
					>
						<div className="is-flex is-jc-space-between">
							<div>
								<FontAwesomeIcon className="icon has-mr-05" icon={faTable} />
								Report
							</div>
							<FontAwesomeIcon
								className="icon has-mr-05"
								icon={showReportMenu ? faAngleLeft : faAngleRight}
							/>
						</div>
						<ul className={`panel menu dropright ${showReportMenu || "is-hidden"}`}>
							<Link link="/report/broken">Broken Items</Link>
							<Link link="/report/lent">Lent Items</Link>
							<Link link="/report/in-stock">In Stock Items</Link>
							<Link link="/report/all-withdrawals">All Withdrawals</Link>
						</ul>
					</li>
					<SideBarLink link="/record/edit-items">
						<FontAwesomeIcon className="icon has-mr-05" icon={faListUl} />
						Edit Items
					</SideBarLink>
					<SideBarLink link="/record/withdraw-items">
						<FontAwesomeIcon className="icon has-mr-05" icon={faArrowAltCircleUp} />
						Withdraw
					</SideBarLink>
					<SideBarLink link="/record/add-items">
						<FontAwesomeIcon className="icon has-mr-05" icon={faArrowAltCircleDown} />
						Add Stock
					</SideBarLink>
					<li
						className="side-bar-menu-item is-clickable"
						onClick={e =>
							this.setState({
								showReportMenu: false,
								showEditMenu: !showEditMenu,
								showSearchMenu: false
							})
						}
					>
						<div className=" is-flex is-jc-space-between">
							<div>
								<FontAwesomeIcon className="icon has-mr-05" icon={faEdit} />
								Information
							</div>
							<FontAwesomeIcon
								className="icon has-mr-05"
								icon={showEditMenu ? faAngleLeft : faAngleRight}
							/>
						</div>
						<ul className={`panel menu dropright ${showEditMenu || "is-hidden"}`}>
							<Link link="/report/customers">Customers</Link>
							<Link link="/report/suppliers">Suppliers</Link>
							<Link link="/report/bulks">Bulks</Link>
							<Link link="/report/product-types">Product Types</Link>
							<Link link="/report/departments">Departments</Link>
							<Link link="/report/staff">Staff</Link>
						</ul>
					</li>
				</ul>
			</div>
		);
	}
}

const Link = props => {
	return (
		<RouterLink to={props.link}>
			<li className="list-item is-clickable">
				{props.children}
			</li>
		</RouterLink>
	);
};
const SideBarLink = props => {
	return (
		<RouterLink to={props.link}>
			<li className="side-bar-menu-item is-clickable">
				{props.children}
			</li>
		</RouterLink>
	);
};

export default Menu;
