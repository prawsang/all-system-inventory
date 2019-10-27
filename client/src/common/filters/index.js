import React from "react";
import Modal from "../components/Modal";
import { setFilters } from "@/actions/report";
import { connect } from "react-redux";
import { Select, Date, Checkbox } from "./form";
import Filter from "./filter";
import moment from "moment";
import { dashedDate } from "../date";
import ProductTypeFilter from "./ProductTypeFilter";

class Filters extends React.Component {
	toggleBooleanFilter(value) {
		return value !== null ? null : false;
	}
	toggleDateFilter(value) {
		return value !== null ? null : dashedDate(moment());
	}
	toggleFilter(value) {
		return value !== null ? null : "";
	}

	render() {
		const { active, close, filters, setFilters } = this.props;
		const {
			broken,
			installed,
			type,
			status,
			from,
			to,
			install_from,
			install_to,
			return_from,
			return_to
		} = this.props;
		return (
			<Modal title="Filters" active={active} close={close}>
				{filters.broken && (
					<Filter
						onChange={() => setFilters({ broken: this.toggleBooleanFilter(broken) })}
						value={broken === null ? false : true}
						render={value => (
							<Checkbox
								disabled={!value}
								label="Broken"
								checked={broken === null ? false : broken}
								onChange={() => setFilters({ broken: !broken })}
							/>
						)}
					/>
				)}
				{filters.installed && (
					<Filter
						onChange={() =>
							setFilters({ installed: this.toggleBooleanFilter(installed) })
						}
						value={installed === null ? false : true}
						render={value => (
							<Checkbox
								disabled={!value}
								label="Installed"
								checked={installed === null ? false : installed}
								onChange={() => setFilters({ installed: !installed })}
							/>
						)}
					/>
				)}
				{filters.itemType && (
					<Filter
						onChange={() => setFilters({ type: this.toggleFilter(type) })}
						value={type === null ? false : true}
						render={value => (
							<ProductTypeFilter disabled={!value} />
						)}
					/>
				)}
				{filters.withdrawalType && (
					<Filter
						onChange={() => setFilters({ type: this.toggleFilter(type) })}
						value={type === null ? false : true}
						render={value => (
							<Select
								disabled={!value}
								label="Type"
								value={type}
								onChange={e => setFilters({ type: e.target.value })}
								options={[
									{
										name: "Installation",
										value: "INSTALLATION"
									},
									{
										name: "Transfer",
										value: "TRANSFER"
									},
									{
										name: "Lending",
										value: "LENDING"
									}
								]}
							/>
						)}
					/>
				)}
				{filters.itemStatus && (
					<Filter
						onChange={() => setFilters({ status: this.toggleFilter(status) })}
						value={status === null ? false : true}
						render={value => (
							<Select
								disabled={!value}
								label="Item Status"
								value={status}
								onChange={e => setFilters({ status: e.target.value })}
								options={[
									{
										name: "In Stock",
										value: "IN_STOCK"
									},
									{
										name: "Transferred",
										value: "TRANSFERRED"
									},
									{
										name: "Pending",
										value: "PENDING"
									},
									{
										name: "Reserved",
										value: "RESERVED"
									},
									{
										name: "Lent",
										value: "LENT"
									},
									{
										name: "Installed",
										value: "INSTALLED"
									}
								]}
							/>
						)}
					/>
				)}
				{filters.withdrawalStatus && (
					<Filter
						onChange={() => setFilters({ status: this.toggleFilter(status) })}
						value={status === null ? false : true}
						render={value => (
							<Select
								disabled={!value}
								label="Status"
								value={status}
								onChange={e => setFilters({ status: e.target.value })}
								options={[
									{
										name: "Pending",
										value: "PENDING"
									},
									{
										name: "Confirmed",
										value: "CONFIRMED"
									},
									{
										name: "Cancelled",
										value: "CANCELLED"
									}
								]}
							/>
						)}
					/>
				)}
				{filters.date && (
					<Filter
						onChange={() =>
							setFilters({
								from: this.toggleDateFilter(from),
								to: this.toggleDateFilter(to)
							})
						}
						value={from === null || to === null ? false : true}
						render={value => (
							<Date
								disabled={!value}
								label="Date"
								fromValue={from}
								fromOnChange={e => setFilters({ from: e.target.value })}
								toValue={to}
								toOnChange={e => setFilters({ to: e.target.value })}
							/>
						)}
					/>
				)}
				{filters.installDate && (
					<Filter
						onChange={() =>
							setFilters({
								install_from: this.toggleDateFilter(install_from),
								install_to: this.toggleDateFilter(install_to)
							})
						}
						value={install_from === null || install_to === null ? false : true}
						render={value => (
							<Date
								disabled={!value}
								label="Installation Date"
								fromValue={install_from}
								fromOnChange={e => setFilters({ install_from: e.target.value })}
								toValue={install_to}
								toOnChange={e => setFilters({ install_to: e.target.value })}
							/>
						)}
					/>
				)}
				{filters.returnDate && (
					<Filter
						onChange={() =>
							setFilters({
								return_from: this.toggleDateFilter(return_from),
								return_to: this.toggleDateFilter(return_to)
							})
						}
						value={return_from === null || return_to === null ? false : true}
						render={value => (
							<Date
								disabled={!value}
								label="Return Date"
								fromValue={return_from}
								fromOnChange={e => setFilters({ return_from: e.target.value })}
								toValue={return_to}
								toOnChange={e => setFilters({ return_to: e.target.value })}
							/>
						)}
					/>
				)}
			</Modal>
		);
	}
}

const mapDispatchToProps = {
	setFilters
};
const mapStateToProps = state => ({
	broken: state.report.filters.broken,
	installed: state.report.filters.installed,
	status: state.report.filters.status,
	type: state.report.filters.type,
	from: state.report.filters.from,
	to: state.report.filters.to,
	install_from: state.report.filters.install_from,
	install_to: state.report.filters.install_to,
	return_from: state.report.filters.return_from,
	return_to: state.report.filters.return_to
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Filters);
