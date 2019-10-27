import React from "react";
import SearchField from "../SearchField";
import { setSelectedObject } from "@/actions/record";
import { connect } from "react-redux";

class BulkSearch extends React.Component {
	render() {
		const { disabled, setSelectedObject } = this.props;
		return (
			<SearchField
				responsibleFor="selectedBulk"
				placeholder="Bulk Code"
				searchUrl="/bulk/get-all"
				searchName="bulk_code"
				label="Bulk"
				disabled={disabled}
				listItem={(e,i) => (
					<span
						key={e.bulk_code + i}
						className="list-item is-clickable"
						onClick={() =>
							setSelectedObject({ selectedBulk: {
								name: e.bulk_code,
							}})
						}
					>
						{e.bulk_code}
					</span>
				)}
			/>
		);
	}
}

const mapDispatchToProps = {
	setSelectedObject
};

export default connect(
	null,
	mapDispatchToProps
)(BulkSearch);
