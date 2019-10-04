import React from "react";

export const Checkbox = ({ label, checked, onChange, disabled }) => (
	<div className="field is-flex is-ai-center no-mb">
		<label className="label">{label}</label>
		<input
			className="checkbox"
			type="checkbox"
			checked={checked === null ? false : checked}
			onChange={onChange}
			disabled={disabled}
		/>
	</div>
);

export const Date = ({ fromValue, fromOnChange, toValue, toOnChange, label, disabled }) => (
	<div className="field no-mb">
		<label className="label">{label}</label>
		<div className="is-flex">
			<div className="col-6 has-mr-05">
				<small className="has-mb-05" style={{ display: "block" }}>
					From:
				</small>
				<input
					className="input is-fullwidth"
					type="date"
					value={fromValue === null ? "" : fromValue}
					onChange={fromOnChange}
					disabled={disabled}
				/>
			</div>
			<div className="col-6 has-ml-05">
				<small className="has-mb-05" style={{ display: "block" }}>
					To:
				</small>
				<input
					className="input is-fullwidth"
					type="date"
					value={toValue === null ? "" : toValue}
					onChange={toOnChange}
					disabled={disabled}
				/>
			</div>
		</div>
	</div>
);

export const Select = ({ options, label, value, onChange, disabled }) => (
	<div className="field no-mb">
		<label className="label">{label}</label>
		<div className="select">
			<select value={value === null ? "" : value} onChange={onChange} disabled={disabled}>
				<option value="">-- Select --</option>
				{options.map((e, i) => (
					<option value={e.value}>{e.name}</option>
				))}
			</select>
		</div>
	</div>
);
