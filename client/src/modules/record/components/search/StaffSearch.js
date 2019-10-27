import React from "react";
import SearchField from "../SearchField";
import { setSelectedStaff } from "@/actions/record";
import { connect } from "react-redux";

class StaffSearch extends React.Component {
	state = {
		showResults: false,
		staff: ""
	};
	render() {
		const { showResults, staff } = this.state;
		const { selectedStaff, setSelectedStaff, disabled } = this.props;
		return (
			<SearchField
				value={selectedStaff ? selectedStaff.name : staff}
				onChange={e => {
					this.setState({ staff: e.target.value });
					setSelectedStaff(null);
				}}
				placeholder="Staff Name"
				label="ผู้เบิก"
				searchUrl="/staff/get-all"
				searchTerm={staff}
				searchName="staff_name"
				disabled={disabled}
				showResults={() => this.setState({ showResults: true })}
				hideResults={() => this.setState({ showResults: false })}
				list={data => (
					<div className={`${showResults || "is-hidden"}`}>
						<StaffSearchList
							staffs={data && data.rows}
							hideResults={() => this.setState({ showResults: false })}
						/>
					</div>
				)}
			/>
		);
	}
}

const List = ({ staffs, setSelectedStaff, hideResults }) => {
	return (
		<div className="panel menu dropdown" onClick={hideResults}>
			{staffs ? (
				staffs.length > 0 ? (
					staffs.map((e, i) => (
						<span
							key={e.staff_name + i}
							className="list-item is-clickable"
							onClick={() =>
								setSelectedStaff({
									staff_code: e.staff_code,
									name: e.staff_name
								})
							}
						>
							{e.staff_name} ({e.staff_code})
						</span>
					))
				) : (
					<span className="list-item">ไม่พบรายการ</span>
				)
			) : (
				<span className="list-item">กรุณาพิมพ์อย่างน้อย 3 ตัวอักษรแล้วกดค้นหา</span>
			)}
		</div>
	);
};

const mapStateToProps = state => ({
	selectedStaff: state.record.selectedStaff
});
const mapDispatchToProps = {
	setSelectedStaff
};

const StaffSearchList = connect(
	null,
	mapDispatchToProps
)(List);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(StaffSearch);
