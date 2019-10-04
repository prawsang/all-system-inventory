import React from "react";

const Filter = ({ onChange, value, render }) => (
	<div className="field">
		<input className="checkbox" type="checkbox" onChange={onChange} checked={value} />
		<div className={`snippet ${value || "is-disabled"}`}>{render(value)}</div>
	</div>
);

export default Filter;
