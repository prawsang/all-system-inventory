import React from "react";
import history from "@/common/history";

class SearchItem extends React.Component {
	state = {
		serialNo: ""
	};

	handleSearch() {
		history.push(`/single/item/${this.state.serialNo}`);
	}

	render() {
		const { serialNo } = this.state;
		return (
			<div className="content">
				<h3>ค้นหาของ</h3>
				<div className="panel">
					<div className="panel-content">
						<form onSubmit={() => this.handleSearch()}>
							<div className="field">
								<label className="label">Serial No.</label>
								<input
									className="input is-fullwidth"
									value={serialNo}
									onChange={e => this.setState({ serialNo: e.target.value })}
									placeholder="Scan Serial No."
								/>
							</div>
							<button className="button" type="submit">
								Search
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default SearchItem;
