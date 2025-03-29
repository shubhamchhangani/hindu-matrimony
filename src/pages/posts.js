// pages/posts.js
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPosts,
  createPost,
  likePost,
  unlikePost,
  deletePost,
  addComment,
} from '../redux/slices/postsSlice';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';

export default function Posts() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const posts = useSelector((state) => state.posts.posts);
  const postsStatus = useSelector((state) => state.posts.status);
  const [newPost, setNewPost] = useState({ caption: '', image: null });
  const [loading, setLoading] = useState(false);
  // Local state for comment input per post
  const [localComments, setLocalComments] = useState({});
  
  // Redirect to signin if no user is logged in
  

  // Fetch posts when component mounts and when user is available
  useEffect(() => {
    if (user) {
      dispatch(fetchPosts());
    }
  }, [dispatch, user]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Dispatch createPost thunk (which handles file upload and post creation)
    await dispatch(createPost({ caption: newPost.caption, imageFile: newPost.image, userId: user.id }));
    setNewPost({ caption: '', image: null });
    setLoading(false);
  };

  const handleLikeToggle = async (postId, isLiked) => {
    if (isLiked) {
      await dispatch(unlikePost({ postId, userId: user.id }));
    } else {
      await dispatch(likePost({ postId, userId: user.id }));
    }
    // Optionally refresh posts (or rely on realtime updates if implemented)  
    dispatch(fetchPosts());
  };

  const handleComment = async (postId, commentContent) => {
    if (!commentContent.trim()) return;
    await dispatch(addComment({ postId, userId: user.id, content: commentContent }));
    // Clear comment input for the given post
    setLocalComments((prev) => ({ ...prev, [postId]: '' }));
    dispatch(fetchPosts());
  };

  const handleDeletePost = async (postId) => {
    await dispatch(deletePost({ postId, userId: user.id }));
    dispatch(fetchPosts());
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="container mx-auto bg-[#fff5e6] px-4 py-8 max-w-lg">
        {/* Post Creation Form */}
        <form onSubmit={handlePostSubmit} className="mb-8 p-4 bg-white rounded-lg shadow">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewPost({ ...newPost, image: e.target.files[0] })}
            className="mb-4 border rounded w-full p-2"
          />
          <textarea
            value={newPost.caption}
            onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
            placeholder="Write your caption..."
            className="w-full p-2 border rounded mb-4"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#b22222] text-white px-4 py-2 rounded w-full hover:bg-red-700"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>

        {/* Posts Listing */}
        <div className="space-y-8">
          {posts && posts.map((post) => {
            const isLiked = post.likes.some((like) => like.user_id === user.id); // No more error
            return (
              <div key={post.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center mb-4">
                  <Image
                    src={post.profile_picture}
                    alt={post.profiles?.full_name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="ml-2 font-semibold">{post.profiles?.full_name}</span>
                  {post.user_id === user.id && (
                    <button onClick={() => handleDeletePost(post.id)} className="ml-auto text-red-500">
                      Delete
                    </button>
                  )}
                </div>
                <Image
                  src={post.image_url}
                  alt="Post"
                  width={500}
                  height={500}
                  className="rounded mb-4"
                />
                <button
                  onClick={() => handleLikeToggle(post.id, isLiked)}
                  className="mb-2 block text-left text-lg font-semibold"
                >
                  {isLiked ? '♥' : '♡'} {post.likes.length} likes
                </button>
                <p className="mb-4 text-gray-800">{post.caption}</p>
                <div className="mb-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-2 text-sm">
                      <span className="font-semibold">{comment.full_name}:</span>
                      <p>{comment.content}</p>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={localComments[post.id] || ''}
                    onChange={(e) =>
                      setLocalComments({ ...localComments, [post.id]: e.target.value })
                    }
                    placeholder="Add a comment..."
                    className="flex-1 border p-2 rounded"
                  />
                  <button
                    onClick={() => handleComment(post.id, localComments[post.id] || '')}
                    className="bg-[#b22222] text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Post
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
