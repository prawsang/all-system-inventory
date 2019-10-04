import React from "react";
import SearchField from "../SearchField";
import { setSelectedBranches } from "@/actions/record";
import { connect } from "react-redux";

class BranchSearch extends React.Component {
	state = {
		showResults: false,
		branch: ""
	};

	render() {
		const { showResults, branch } = this.state;
		const {
			selectedBranches,
			setSelectedBranches,
			selectedJobCode,
			disabled,
			single
		} = this.props;

		return (
			<SearchField
				value={branch}
				onChange={e => {
					this.setState({ branch: e.target.value });
				}}
				placeholder="Branch Name"
				searchUrl={`/job/${selectedJobCode}/branches`}
				searchTerm={branch}
				searchName="branch_name"
				disabled={disabled}
				showResults={() => this.setState({ showResults: true })}
				hideResults={() => this.setState({ showResults: false })}
				list={data => (
					<div className={`${showResults || "is-hidden"}`}>
						<div
							className="panel menu dropdown"
							onClick={() => this.setState({ showResults: false })}
						>
							{data ? (
								data.rows.length > 0 ? (
									data.rows.map((e, i) => (
										<span
											key={e.branch_name + i}
											className="list-item is-clickable"
											onClick={() => {
												if (!single) {
													setSelectedBranches([
														...selectedBranches,
														{
															id: e.branch_id,
															name: e.branch_name,
															branch_code: e.branch_code,
															installed: false
														}
													]);
													this.setState({ branch: "" });
												} else {
													setSelectedBranches([
														{
															id: e.branch_id,
															name: e.branch_name,
															branch_code: e.branch_code,
															installed: false
														}
													]);
													this.setState({ branch: e.branch_name });
												}
											}}
										>
											{e.branch_name} {e.branch_code && `(${e.branch_code})`}
										</span>
									))
								) : (
									<span className="list-item">ไม่พบรายการ</span>
								)
							) : (
								<span className="list-item">
									กรุณาพิมพ์อย่างน้อย 3 ตัวอักษรแล้วกดค้นหา
								</span>
							)}
						</div>
					</div>
				)}
			/>
		);
	}
}

const mapStateToProps = state => ({
	selectedBranches: state.record.selectedBranches,
	selectedJobCode: state.record.selectedJobCode
});
const mapDispatchToProps = {
	setSelectedBranches
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BranchSearch);
