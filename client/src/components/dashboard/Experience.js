import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { deleteExperience } from "../../actions/profileActions";

class Experience extends Component {
	onDeleteClick(expId) {
		this.props.deleteExperience(expId);
	}

	render() {
		const experience = this.props.experience.map(exp => (
			<tr key={exp.id}>
				<td>{exp.company}</td>
				<td>{exp.title}</td>
				<td>
					<Moment format="YYYY/MM/DD">{exp.from}</Moment> -{" "}
					{exp.to === null ? (
						"Now"
					) : (
						<Moment format="YYYY/MM/DD">{exp.to}</Moment>
					)}
				</td>
				<td>
					<button
						className="btn btn-danger"
						onClick={this.onDeleteClick.bind(this, exp._id)}
					>
						Delete
					</button>
				</td>
			</tr>
		));

		return (
			<div>
				<h4 className="mb-4">Experience</h4>
				<table className="table">
					<tr>
						<th>Company</th>
						<th>Title</th>
						<th>Dates</th>
						<th />
					</tr>
					<tbody>{experience}</tbody>
				</table>
			</div>
		);
	}
}

Experience.propType = {
	deleteExperience: PropTypes.func.isRequired
};

export default connect(
	null,
	{ deleteExperience }
)(Experience);
