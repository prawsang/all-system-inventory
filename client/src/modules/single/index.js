import React from "react";
import { Route, Switch } from "react-router-dom";
import Branch from "./pages/branch/";
import Item from "./pages/item/";
import Bulk from "./pages/bulk/";
import Model from "./pages/model/";
import Customer from "./pages/customer/";
import Staff from "./pages/staff/";
import Department from "./pages/department/";
import Withdrawal from "./pages/withdrawal/";
import Supplier from "./pages/supplier";
import AddItemsToWithdrawal from "./pages/withdrawal/addItems";
import AddItemsToBulk from "./pages/bulk/addItems";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";

class Single extends React.Component {
	render() {
		return (
			<div className="content">
				<Switch>
					<Route path="/single/branch/:branch_id" component={BranchPage} />
					<Route path="/single/item/:serial_no" component={ItemPage} />
					<Route
						path="/single/bulk/:bulk_code/add-items"
						component={AddItemsToBulk}
					/>
					<Route path="/single/bulk/:bulk_code" component={BulkPage} />
					<Route path="/single/model/:model_code" component={ModelPage} />
					<Route path="/single/customer/:customer_code" component={CustomerPage} />
					<Route path="/single/supplier/:supplier_code" component={SupplierPage} />
					<Route path="/single/department/:department_code" component={DepartmentPage} />
					<Route path="/single/staff/:staff_code" component={StaffPage} />
					<Route
						path="/single/withdrawal/:id/add-items"
						component={AddItemsToWithdrawal}
					/>
					<Route path="/single/withdrawal/:id" component={WithdrawalPage} />
				</Switch>
			</div>
		);
	}
}

const BranchPage = props => {
	const { branch_id } = props.match.params;
	return (
		<FetchDataFromServer
			url={`/branch/${branch_id}/details`}
			render={data => <Branch data={data} />}
		/>
	);
};

const ItemPage = props => {
	const { serial_no } = props.match.params;
	return (
		<FetchDataFromServer
			url={`/item/${serial_no}/details`}
			render={data => <Item data={data} />}
		/>
	);
};

const BulkPage = props => {
	const { bulk_code } = props.match.params;
	return (
		<FetchDataFromServer
			url={`/bulk/${bulk_code}/details`}
			render={data => <Bulk data={data} />}
		/>
	);
};

const ModelPage = props => {
	const { model_code } = props.match.params;
	return (
		<FetchDataFromServer
			url={`/model/${model_code}/details`}
			render={data => <Model data={data} />}
		/>
	);
};

const CustomerPage = props => {
	const { customer_code } = props.match.params;
	return (
		<FetchDataFromServer
			url={`/customer/${customer_code}/details`}
			render={data => <Customer data={data} />}
		/>
	);
};

const DepartmentPage = props => {
	const { department_code } = props.match.params;
	return (
		<FetchDataFromServer
			url={`/department/${department_code}/details`}
			render={data => <Department data={data} />}
		/>
	);
};

const StaffPage = props => {
	const { staff_code } = props.match.params;
	return (
		<FetchDataFromServer
			url={`/staff/${staff_code}/details`}
			render={data => <Staff data={data} />}
		/>
	);
};

const WithdrawalPage = props => {
	const { id } = props.match.params;
	return (
		<FetchDataFromServer
			url={`/withdrawal/${id}/details`}
			render={data => <Withdrawal data={data} id={id} />}
		/>
	);
};

const SupplierPage = props => {
	const { supplier_code } = props.match.params;
	return (
		<FetchDataFromServer
			url={`/supplier/${supplier_code}/details`}
			render={data => <Supplier data={data} />}
		/>
	);
};

export default Single;
