import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

class ProfileGithub extends Component {
	constructor(props) {
		super(props);
		this.state = {
			clientId: "76d18279cc17fd86ca10",
			clientSecret: "70f142b37dc1bc7b2876ddf3c7fa05f5b3ff0061",
			count: 5,
			sort: "create: asc",
			repos: []
		};
	}

	componentDidMount() {
		const { username } = this.props;
		const { count, sort, clientId, clientSecret } = this.state;
		fetch(
			`https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`
		)
			.then(res => res.json())
			.then(data => {
				this.setState({ repos: data });
			})
			.catch(err => console.log(err));
	}

	render() {
		const { repos } = this.state;

		const reposContent = repos.map(repo => (
			<div key={repo.id} className="card card-body mb-2">
				<div className="row">
					<div className="col-md-6">
						<h4>
							<a href={repo.html_url} className="text-info" tager="_blank">
								{repo.name}
							</a>
						</h4>
						<p>{repo.description}</p>
					</div>
					<div className="col-md-6">
						<span className="badge badge-info mr-1 float-right">
							Stars: {repo.stargazers_count}
						</span>
						<span className="badge badge-secondary mr-1 float-right">
							Watchers: {repo.watchers_count}
						</span>
						<span className="badge badge-success mr-1 float-right">
							Forks: {repo.forks_count}
						</span>
					</div>
				</div>
			</div>
		));
		return (
			<div ref>
				<hr />
				<h3 className="mb-4">Latest Github repos</h3>
				{reposContent}
			</div>
		);
	}
}

ProfileGithub.propTypes = { username: PropTypes.string.isRequired };

export default ProfileGithub;
