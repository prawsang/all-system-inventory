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
import history from "@/common/history";
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
								ค้นหา
							</div>
							<FontAwesomeIcon
								className="icon has-mr-05"
								icon={showSearchMenu ? faAngleLeft : faAngleRight}
							/>
						</div>
						<ul className={`panel menu dropright ${showSearchMenu || "is-hidden"}`}>
							<Link link="/search-item">ค้นหาสินค้า</Link>
							<Link link="/search-withdrawal">ค้นหาใบเบิก</Link>
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
								รายงาน
							</div>
							<FontAwesomeIcon
								className="icon has-mr-05"
								icon={showReportMenu ? faAngleLeft : faAngleRight}
							/>
						</div>
						<ul className={`panel menu dropright ${showReportMenu || "is-hidden"}`}>
							<Link link="/report/broken">ของเสีย</Link>
							<Link link="/report/lent">ของยืม</Link>
							<Link link="/report/in-stock">Stock คงเหลือ</Link>
							<Link link="/report/all-withdrawals">ใบเบิกทั้งหมด</Link>
						</ul>
					</li>
					<SideBarLink link="/record/edit-items">
						<FontAwesomeIcon className="icon has-mr-05" icon={faListUl} />
						ปรับปรุงรายการ
					</SideBarLink>
					<SideBarLink link="/record/withdraw-items">
						<FontAwesomeIcon className="icon has-mr-05" icon={faArrowAltCircleUp} />
						เบิกสินค้า
					</SideBarLink>
					<SideBarLink link="/record/add-items">
						<FontAwesomeIcon className="icon has-mr-05" icon={faArrowAltCircleDown} />
						รับของเข้า Stock
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
								ดู/แก้ไขข้อมูล
							</div>
							<FontAwesomeIcon
								className="icon has-mr-05"
								icon={showEditMenu ? faAngleLeft : faAngleRight}
							/>
						</div>
						<ul className={`panel menu dropright ${showEditMenu || "is-hidden"}`}>
							<Link link="/report/customers">ข้อมูลลูกค้า</Link>
							<Link link="/report/suppliers">Supplier ทั้งหมด</Link>
							<Link link="/report/bulks">ล็อตสินค้าทั้งหมด</Link>
							<Link link="/report/product-types">ประเภทสินค้าทั้งหมด</Link>
							<Link link="/report/departments">แผนกทั้งหมด</Link>
							<Link link="/report/staff">พนักงานทั้งหมด</Link>
						</ul>
					</li>
				</ul>
			</div>
		);
	}
}

const Link = props => {
	return (
		<li className="list-item is-clickable" onClick={() => history.push(props.link)}>
			{props.children}
		</li>
	);
};
const SideBarLink = props => {
	return (
		<li className="side-bar-menu-item is-clickable" onClick={() => history.push(props.link)}>
			{props.children}
		</li>
	);
};

export default Menu;
