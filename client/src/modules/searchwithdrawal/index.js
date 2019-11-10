import React from "react";
import history from "@/common/history";

class SearchWithdrawal extends React.Component {
	state = {
		id: ""
	};

	handleSearch() {
		history.push(`/single/withdrawal/${this.state.id}`);
	}

	render() {
		const { id } = this.state;
		return (
			<div className="content">
				<h3>ค้นหาใบเบิก</h3>
				<div className="panel">
					<div className="panel-content">
						<form onSubmit={() => this.handleSearch()}>
							<div className="field">
								<label className="label">Withdrawal ID</label>
								<input
									className="input is-fullwidth"
									value={id}
									onChange={e => this.setState({ id: e.target.value })}
									placeholder="Withdrawal ID"
									type="number"
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

export default SearchWithdrawal;
