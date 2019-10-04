import React from "react";
import history from "@/common/history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

export const BranchData = ({ data, withCustomer }) => {
	if (!data) return <p className="no-mt has-mb-10 is-gray-4">No Branch</p>;
	return (
		<div>
			<h5 className="no-mt has-mb-10">
				Branch
				<span
					className="is-clickable accent has-ml-10 is-6"
					onClick={() => history.push(`/single/branch/${data.id}`)}
				>
					<FontAwesomeIcon icon={faExternalLinkAlt} />
				</span>
			</h5>
			<div className="has-mb-10">
				<label className="is-bold has-mr-05">Branch Code:</label>
				<span>{data.branch_code}</span>
			</div>
			<div className="has-mb-10">
				<label className="is-bold has-mr-05">Branch Name:</label>
				<span>{data.name}</span>
			</div>
			{withCustomer && (
				<div>
					<div className="has-mb-10">
						<label className="is-bold has-mr-05">Customer Name:</label>
						<span>{data.customer.name}</span>
					</div>
					<div className="has-mb-10">
						<label className="is-bold has-mr-05">Customer Code:</label>
						<span>{data.customer.customer_code}</span>
					</div>
				</div>
			)}
		</div>
	);
};

export const JobData = ({ data }) => {
	if (!data) return <p className="no-mt has-mb-10 is-gray-4">No Job</p>;
	return (
		<div>
			<h5 className="no-mt has-mb-10">
				Job
				<span
					className="is-clickable accent has-ml-10 is-6"
					onClick={() => history.push(`/single/job/${data.job_code}`)}
				>
					<FontAwesomeIcon icon={faExternalLinkAlt} />
				</span>
			</h5>
			<div className="has-mb-10">
				<label className="is-bold has-mr-05">Job Code:</label>
				<span>{data.job_code}</span>
			</div>
			<div className="has-mb-10">
				<label className="is-bold has-mr-05">Job Name:</label>
				<span>{data.name}</span>
			</div>
		</div>
	);
};

export const CustomerData = ({ data }) => {
	if (!data) return <p className="no-mt has-mb-10 is-gray-4">No Customer</p>;
	return (
		<div>
			<h5 className="no-mt has-mb-10">
				Customer
				<span
					className="is-clickable accent has-ml-10 is-6"
					onClick={() => history.push(`/single/customer/${data.customer_code}`)}
				>
					<FontAwesomeIcon icon={faExternalLinkAlt} />
				</span>
			</h5>
			<div className="has-mb-10">
				<label className="is-bold has-mr-05">Customer Code:</label>
				<span>{data.customer_code}</span>
			</div>
			<div className="has-mb-10">
				<label className="is-bold has-mr-05">Customer Name:</label>
				<span>{data.name}</span>
			</div>
		</div>
	);
};
