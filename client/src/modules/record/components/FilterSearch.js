import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import { setFilters } from "@/actions/report";
import { setStaticData } from "@/actions/record";
import { connect } from "react-redux";

class SearchField extends React.Component {
	state = {
		data: null,
		searchedDataFrontEnd: null,
		showResults: false,
		value: ""
	};
	handleSearch() {
		const { searchUrl, filterName, frontEnd, staticData, staticDataType } = this.props;
		const { value } = this.state;
		if (value.length < 3 && !frontEnd) {
			this.setState({ data: null });
		} else {
			if (frontEnd) {
				if (staticData && staticData[staticDataType] && staticData[staticDataType].length > 0) {
					this.setState({ searchedDataFrontEnd: staticData[staticDataType] })
				} else {
					this.makeServerRequest({ searchUrl, filterName, value, staticDataType, frontEnd });
				}
			} else {
				this.makeServerRequest({ searchUrl, filterName, value, staticDataType, frontEnd });
			}
		}
	}

	makeServerRequest({ searchUrl, filterName, value, staticDataType, frontEnd }) {
		Axios.get(`${searchUrl}?${filterName}=${value}`).then(
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
		if (value.length >= 3) {
			this.setState({
				searchedDataFrontEnd: data ? data.rows.filter(e => e[searchName].includes(value)) : null
			});
		}
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
			frontEnd
        } = this.props;

		const { showResults, value } = this.state;
		return (
			<div className={`field ${disabled && "is-disabled"}`} onFocus={() => this.setState({ showResults: true })}>
				<label className="label has-no-line-break">{label}</label>
				<div className="is-flex">
					<input
						className="input is-flex-fullwidth"
						placeholder={placeholder}
						value={this.props[responsibleFor] ? this.props[responsibleFor] : value}
						onChange={e => {
							this.setState({ value: e.target.value });
                            setFilters(this.makeObject(responsibleFor, null))
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
						onClick={() => this.handleSearch()}
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
									<span className="list-item">ไม่พบรายการ</span>
								)
							) : (
								<span className="list-item">{frontEnd ? "กรุณารอสักครู่" : "กรุณาพิมพ์อย่างน้อย 3 ตัวอักษรแล้วกดค้นหา"}</span>
							)}
						</div>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	type: state.report.filters.type,
	staticData: state.record.staticData
})
const mapDispatchToProps = {
	setFilters,
	setStaticData
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchField);
