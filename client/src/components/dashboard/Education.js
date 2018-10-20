import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { deleteEducation } from "../../actions/profileActions";

class Education extends Component {
	onDeleteClick(expId) {
		this.props.deleteEducation(expId);
	}

	render() {
		const education = this.props.education.map(edu => (
			<tr key={edu.id}>
				<td>{edu.school}</td>
				<td>{edu.degree}</td>
				<td>
					<Moment format="YYYY/MM/DD">{edu.from}</Moment> -{" "}
					{edu.to === null ? (
						"Now"
					) : (
						<Moment format="YYYY/MM/DD">{edu.to}</Moment>
					)}
				</td>
				<td>
					<button
						className="btn btn-danger"
						onClick={this.onDeleteClick.bind(this, edu._id)}
					>
						Delete
					</button>
				</td>
			</tr>
		));

		return (
			<div>
				<h4 className="mb-4">Education</h4>
				<table className="table">
					<tr>
						<th>Company</th>
						<th>Title</th>
						<th>Dates</th>
						<th />
					</tr>
					<tbody>{education}</tbody>
				</table>
			</div>
		);
	}
}

Education.propType = {
	deleteEducation: PropTypes.func.isRequired
};

export default connect(
	null,
	{ deleteEducation }
)(Education);
