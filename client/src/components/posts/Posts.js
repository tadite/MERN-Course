import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PostForm from "./PostForm";
import Spinner from "../common/Spinner";
import { getPosts } from "../../actions/postActions";
import PostFeed from "./PostFeed";

class Posts extends Component {
	componentWillMount = () => {};

	componentDidMount = () => {
		this.props.getPosts();
	};

	render() {
		const { posts, loading } = this.props;
		let postContent;

		if (posts === null || loading) {
			postContent = <Spinner />;
		} else {
			postContent = <PostFeed posts={posts} />;
		}
		return (
			<div className="feed">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<PostForm />
							{postContent}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Posts.propTypes = {
	posts: PropTypes.array.isRequired,
	getPosts: PropTypes.func.isRequired
};

const mapStateToProps = state => ({ posts: state.post.posts });

export default connect(
	mapStateToProps,
	{ getPosts }
)(Posts);
