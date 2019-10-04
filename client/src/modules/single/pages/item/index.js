import React from "react";
import Table from "@/common/components/InnerTable";
import WithdrawalsTable from "@/common/tables/withdrawalStatic";
import history from "@/common/history";
import Edit from "./Edit";

class Item extends React.Component {
	state = {
		edit: false
	};
	render() {
		const { data } = this.props;
		const { edit } = this.state;
		if (data) {
			if (!data.item) return <p>ไม่พบรายการ</p>;
		}
		return (
			<React.Fragment>
				<h3>Item: {data && data.item.serial_no}</h3>
				<div className="panel">
					{data && (
						<React.Fragment>
							<div className="panel-content no-pb">
								<div>
									<div style={{ float: "right" }}>
										<button
											className="button"
											onClick={() =>
												this.setState({
													edit: true
												})
											}
										>
											Edit
										</button>
									</div>
									<h5 className="no-mt has-mb-10">Item</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Status:</label>
										<span>{data.item.status}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Bulk Code:</label>
										<span>{data.item.bulk.bulk_code}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Model Name:</label>
										<span>{data.item.bulk.model.name}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Price Per Unit:</label>
										<span>{data.item.bulk.price_per_unit}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Product Type:</label>
										<span>{data.item.bulk.model.product_type.type_name}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Broken?</label>
										<span>
											{data.item.is_broken ? (
												<span className="danger is-bold">Broken</span>
											) : (
												"Not Broken"
											)}
										</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Remarks:</label>
										<span>{data.item.remarks}</span>
									</div>
								</div>
								<hr />
								<div>
									<h5 className="no-mt has-mb-10">Reserved By</h5>
									{data.item.reserved_by_branch && (
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Branch:</label>
											<span
												className="accent is-clickable"
												onClick={() =>
													history.push(
														`/single/branch/${
															data.item.reserved_by_branch.id
														}`
													)
												}
											>
												{data.item.reserved_by_branch.name}{" "}
												{data.item.reserved_by_branch.branch_code}
											</span>
										</div>
									)}
									{!data.item.reserved_by_branch && (
										<span>This item is not reserved.</span>
									)}
								</div>
								<hr />
							</div>
							<Table
								data={data}
								table={data => <WithdrawalsTable data={data.item} />}
								className="no-pt"
								title="ประวัติการเบิก"
								noPage={true}
							/>
							<Edit
								item={data.item}
								close={() => this.setState({ edit: false })}
								active={edit}
							/>
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}

export default Item;
