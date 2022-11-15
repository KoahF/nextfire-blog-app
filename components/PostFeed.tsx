import Link from 'next/link';
import React from 'react';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/system/Stack';

import { Post } from '../utils/typings';
interface PostFeedProps {
	posts: Post[];
	admin?: boolean;
}

const PostFeed = ({ posts, admin = false }: PostFeedProps) => {
	return (
		posts && (
			<>
				{posts.map((post) => (
					<PostItem post={post} key={post.slug} admin={admin} />
				))}
			</>
		)
	);
};

interface PostItemProps {
	post: Post;
	admin: boolean;
}
const PostItem = ({ post, admin }: PostItemProps) => {
	const wordCount = post?.content.trim().split(/\s+/g).length;
	const minutesToRead = (wordCount / 100 + 1).toFixed(0);

	return (
		<Paper elevation={2} className="p-6 mt-5">
			<Link href={`/${post.username}`}>
				<strong>By @{post.username}</strong>
			</Link>
			<Link href={`/${post.username}/${post.slug}`}>
				<h2>{post.title}</h2>
			</Link>

			<footer>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
				>
					<div>
						{wordCount} words, {minutesToRead} min read
					</div>
					<div>💗 1 Hearts</div>
				</Stack>
			</footer>
		</Paper>
	);
};

export default PostFeed;
