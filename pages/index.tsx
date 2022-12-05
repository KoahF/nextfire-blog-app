import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import {
	collectionGroup,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	Timestamp,
	where,
} from 'firebase/firestore';

import Button from '@mui/material/Button';

import PostFeed from '../components/PostFeed';
import { firestore } from '../firebase';
import styles from '../styles/Home.module.css';
import { postToJSON } from '../utils/helpers';
import { Post } from '../utils/typings';
import { CircularProgress } from '@mui/material';

const LIMIT = 1;

export const getServerSideProps: GetServerSideProps = async () => {
	const postsQuery = query(
		collectionGroup(firestore, 'posts'),
		where('published', '==', true),
		orderBy('createdAt', 'desc'),
		limit(LIMIT)
	);

	const posts = (await getDocs(postsQuery)).docs.map((doc) =>
		postToJSON(doc.data())
	);

	return {
		props: {
			posts,
		},
	};
};

interface HomePageProps {
	posts: Post[];
}
export default function Home(props: HomePageProps) {
	const [posts, setPosts] = useState<Post[]>(props.posts);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [isAtTheEnd, setIsAtTheEnd] = useState<boolean>(false);

	const handleGetMorePosts = async () => {
		setIsLoading(true);
		const lastPostOfPage = posts[posts.length - 1];

		const cursor =
			typeof lastPostOfPage.createdAt === 'number'
				? Timestamp.fromMillis(lastPostOfPage.createdAt)
				: lastPostOfPage.createdAt;

		const postsRef = collectionGroup(firestore, 'posts');
		const q = query(
			postsRef,
			where('published', '==', true),
			orderBy('createdAt', 'desc'),
			startAfter(cursor),
			limit(LIMIT)
		);
		try {
			const newPosts: any = (await getDocs(q)).docs.map((doc) => doc.data());
			setPosts(posts.concat(newPosts));
			if (newPosts.length < LIMIT) {
				setIsAtTheEnd(true);
			}
		} catch (e) {
			console.log(e);
		}
		setIsLoading(false);
	};

	return (
		<div className={styles.container}>
			<Head>
				<title> ⏭🔥 Nextfire Blog</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="p-12 px-24">
				<PostFeed posts={posts} />
				<div className="mt-6">
					{isLoading && <CircularProgress />}
					{isAtTheEnd && 'You have reached the end!'}
					{!isLoading && !isAtTheEnd && (
						<Button variant="contained" onClick={handleGetMorePosts}>
							Load more
						</Button>
					)}
				</div>
			</main>
		</div>
	);
}
