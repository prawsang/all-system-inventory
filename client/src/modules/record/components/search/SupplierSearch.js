import React from "react";
import SearchField from "../SearchField";
import { setSelectedObject } from "@/actions/record";
import { connect } from "react-redux";

class SupplierSearch extends React.Component {
	state = {
		showResults: false,
		supplier: ""
	};
	render() {
		const { showResults, supplier } = this.state;
		const { selectedSupplier, setSelectedObject, disabled } = this.props;
		return (
			<SearchField
				value={selectedSupplier ? selectedSupplier.name : supplier}
				onChange={e => {
					this.setState({ supplier: e.target.value });
					setSelectedObject({
						selectedSupplier: null
					});
				}}
				placeholder="Supplier Name"
				searchUrl="/supplier/get-all"
				searchTerm={supplier}
				searchName="supplier_name"
				disabled={disabled}
				label="Supplier"
				showResults={() => this.setState({ showResults: true })}
				hideResults={() => this.setState({ showResults: false })}
				list={data => (
					<div className={`${showResults || "is-hidden"}`}>
						<SupplierSearchList
							suppliers={data && data.rows}
							hideResults={() => this.setState({ showResults: false })}
						/>
					</div>
				)}
			/>
		);
	}
}

const List = ({ suppliers, setSelectedObject, hideResults }) => {
	return (
		<div className="panel menu dropdown" onClick={hideResults}>
			{suppliers ? (
				suppliers.length > 0 ? (
					suppliers.map((e, i) => (
						<span
							key={e.supplier_name + i}
							className="list-item is-clickable"
							onClick={() =>
								setSelectedObject({ selectedSupplier: {
									supplier_code: e.supplier_code,
									name: e.supplier_name
								}})
							}
						>
							{e.supplier_name} ({e.supplier_code})
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
	selectedSupplier: state.record.selectedSupplier
});
const mapDispatchToProps = {
	setSelectedObject
};

const SupplierSearchList = connect(
	null,
	mapDispatchToProps
)(List);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SupplierSearch);
