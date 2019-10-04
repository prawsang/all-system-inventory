import React from "react";
import Modal from "./Modal";
import { setError } from "@/actions/error";
import { connect } from "react-redux";

const Error = ({ error, setError }) => {
	if (error !== null) {
		return (
			<Modal
				active={error !== null}
				close={() => setError(null)}
				title="The following error(s) occured."
				style={{ zIndex: 9999 }}
			>
				{error.data.errors ? (
					error.data.errors.length > 0 ? (
						<ul>
							{error.data.errors.map((e, i) => {
								if (e.msg) return <li key={i}>{e.msg}</li>;
								if (e.message) return <li key={i}>{e.message}</li>;
								return <li key={i}>An unknown error as occured.</li>;
							})}
						</ul>
					) : (
						<p>An unknown error has occured. Status code {error.status}</p>
					)
				) : (
					<p>An unknown error has occured. Status code {error.status}</p>
				)}
			</Modal>
		);
	} else {
		return <div style={{ display: "none" }} />;
	}
};

const mapStateToProps = state => ({
	error: state.error.error
});

const mapDispatchToProps = {
	setError
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Error);
