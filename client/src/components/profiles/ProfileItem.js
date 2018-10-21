import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import isEmpty from "../../validation/is-empty";
import { spawn } from "child_process";

class ProfileItem extends Component {
	render() {
		const { profile } = this.props;
		return (
			<div classNames="card card-body">
				<div className="row mb-3 py-3 bg-light border">
					<div className="col-2">
						<img src={profile.user.avatar} alt="" className="rounded-circle" />
					</div>
					<div className="col-lg-6 col-md-4 col-8">
						<h3>{profile.user.name}</h3>
						<p>
							{profile.status}{" "}
							{isEmpty(profile.company) ? null : (
								<span>at {profile.company}</span>
							)}
						</p>
						<p>
							{isEmpty(profile.location) ? null : (
								<span>{profile.location}</span>
							)}
						</p>
						<Link to={`/profile/${profile.handle}`} className="btn btn-info">
							View profile
						</Link>
					</div>
					<div className="col-md-4 d-none d-md-block">
						<h4>Skill set</h4>
						<ul className="list-group">
							{profile.skills.slice(0, 4).map((skill, index) => (
								<ul key={index} className="list-group-item">
									<i className="fa fa-check pr-1" />
									{skill}
								</ul>
							))}
						</ul>
					</div>
				</div>
			</div>
		);
	}
}

ProfileItem.propTypes = {
	profile: PropTypes.object.isRequired
};

export default ProfileItem;
