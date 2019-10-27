import React from "react";
import SearchField from "../SearchField";
import { setSelectedModel } from "@/actions/record";
import { connect } from "react-redux";

class ModelSearch extends React.Component {
	state = {
		showResults: false,
		model: ""
	};

	render() {
		const { showResults, model } = this.state;
		const {
			setSelectedModel,
			selectedSupplier,
			disabled
		} = this.props;

		return (
			<SearchField
				value={model}
				onChange={e => {
					this.setState({ model: e.target.value });
				}}
				placeholder="Branch Name"
				searchUrl={selectedSupplier ? `/supplier/${selectedSupplier.supplier_code}/models` : ""}
				searchTerm={model}
				searchName="model_name"
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
											key={e.model_name + i}
											className="list-item is-clickable"
											onClick={() => {
												setSelectedModel(
													{
														name: e.model_name,
														model_code: e.model_code,
													}
												);
												this.setState({ model: e.model_name });
											}}
										>
											{e.model_name} ({e.model_code})
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
	selectedModel: state.record.selectedModel,
	selectedSupplier: state.record.selectedSupplier
});
const mapDispatchToProps = {
	setSelectedModel
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ModelSearch);
