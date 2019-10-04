import React from "react";

const Field = ({
	editable,
	label,
	text,
	name,
	type = "text",
	onChange,
	value,
	inputClassName,
	pClassName,
	placeholder
}) => (
	<div className="field is-flex is-ai-center">
		<label className="label">{label}:</label>
		<input
			className={`${
				type === "text" || type === "date" ? "input" : type
			} ${inputClassName} ${editable || "is-hidden"}`}
			value={value}
			onChange={onChange}
			readOnly={!editable}
			type={type ? type : "text"}
			checked={value}
			name={name}
			placeholder={placeholder ? placeholder : label}
		/>
		<span className={`${pClassName} ${editable && "is-hidden"}`}>{text ? text : value}</span>
	</div>
);

export default Field;
