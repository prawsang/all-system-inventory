import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import { setSelectedObject, setStaticData } from "@/actions/record";
import { connect } from "react-redux";

class SearchField extends React.Component {
	state = {
		data: null,
		searchedDataFrontEnd: null,
		showResults: false,
		value: ""
	};
	handleSearch() {
		const { searchUrl, searchName, frontEnd, staticData, staticDataType } = this.props;
		const { value } = this.state;
		if (value.length < 3 && !frontEnd) {
			this.setState({ data: null });
		} else {
			if (frontEnd) {
				if (staticData && staticData[staticDataType] && staticData[staticDataType].length > 0) {
					this.setState({ searchedDataFrontEnd: staticData[staticDataType] })
				} else {
					this.makeServerRequest({ searchUrl, searchName, value, staticDataType, frontEnd });
				}
			} else {
				this.makeServerRequest({ searchUrl, searchName, value, staticDataType, frontEnd });
			}
		}
	}

	makeServerRequest({ searchUrl, searchName, value, staticDataType, frontEnd }) {
		Axios.get(`${searchUrl}?search_col=${searchName}&search_term=${value}`).then(
			res => {
				this.setState({ data: res.data });
				this.setState({ searchedDataFrontEnd: res.data.rows });
				if (frontEnd) {
					if (staticDataType === "departments") {
						this.props.setStaticData({
							departments: res.data.rows
						})
					} else if (staticDataType === "productTypes") {
						this.props.setStaticData({
							productTypes: res.data.rows
						})
					} else if (staticDataType === "staff") {
						this.props.setStaticData({
							staff: res.data.rows
						})
					}
				}
				console.log(res);
			}
		);
	}

	handleSearchFrontEnd() {
		const { searchName } = this.props;
		const { value, data } = this.state;
		console.log(value);
		this.setState({
			searchedDataFrontEnd: data ? data.rows.filter(e => e[searchName].includes(value)) : null
		});
	}
	handleKeyPress(e) {
		const { frontEnd } = this.props;
		if (e.key === "Enter") {
			if (frontEnd) {
				this.handleSearchFrontEnd();
			} else {
				this.handleSearch();
			}
		}
	}

	getData() {
		const { frontEnd } = this.props;
		if (frontEnd) {
			return {
				rows: this.state.searchedDataFrontEnd
			};
		} else return this.state.data;
	}
	makeObject(key, value) {
		const obj = {};
		obj[key] = value;
		return obj;
	}
	render() {
		const {
			label,
			placeholder,
			listItem,
			disabled,
			responsibleFor,
			setSelectedObject,
			frontEnd
		} = this.props;
		const { showResults, value } = this.state;
		return (
			<div 
				className={`field ${disabled && "is-disabled"}`} 
				onFocus={() =>{
					this.setState({ showResults: true });
				}} 
				// onBlur={() => {
				// 	if (!this.props[responsibleFor]) {
				// 		this.setState({ value: ""});
				// 	}
				// }}
			>
				<label className="label has-no-line-break">{label}</label>
				<div className="is-flex">
					<input
						className="input is-flex-fullwidth"
						placeholder={placeholder}
						value={this.props[responsibleFor] ? this.props[responsibleFor].name : value}
						onChange={e => {
							this.setState({ value: e.target.value });
							setSelectedObject(this.makeObject(responsibleFor, null));
						}}
						onKeyPress={e => this.handleKeyPress(e)}
						onFocus={() => {
							if (frontEnd) this.handleSearch();
						}}
						disabled={disabled}
					/>
					<button
						className="button has-ml-05 no-mb"
						type="button"
						onClick={() => {
							if (frontEnd) {
								this.handleSearchFrontEnd();
							} else {
								this.handleSearch();
							}
						}}
					>
						<FontAwesomeIcon icon={faSearch} />
					</button>
					{ listItem && (
						<div 
							className={`panel menu dropdown ${showResults || "is-hidden"}`} 
							onClick={() => this.setState({ showResults: false })}
						>
							{(this.getData() && this.getData().rows) ? (
								this.getData().rows.length > 0 ? (
									this.getData().rows.map((e, i) => listItem(e,i))
								) : (
									<span className="list-item">Not found.</span>
								)
							) : (
								<span className="list-item">{frontEnd ? "Please Wait" : "Please type at least 3 characters and press enter to search."}</span>
							)}
						</div>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	selectedCustomer: state.record.selectedCustomer,
	selectedBranch: state.record.selectedBranch,
	selectedSupplier: state.record.selectedSupplier,
	selectedModel: state.record.selectedModel,
	selectedStaff: state.record.selectedStaff,
	selectedDepartment: state.record.selectedDepartment,
	selectedProductType: state.record.selectedProductType,
	selectedBulk: state.record.selectedBulk,
	staticData: state.record.staticData
})
const mapDispatchToProps = {
	setSelectedObject,
	setStaticData
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchField);
