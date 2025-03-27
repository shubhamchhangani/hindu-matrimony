import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, createPost, deletePost, updatePost } from '../redux/slices/postsSlice';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MyPosts = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const posts = useSelector((state) => state.posts.posts);
  const [newPost, setNewPost] = useState({ caption: '', image: null });
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState(null); // Track the post being edited
  const [updatedPost, setUpdatedPost] = useState({ caption: '', image: null }); // Updated post data

  console.log('Logged-in user:', user); // Debugging
  console.log('Redux posts state:', posts); // Debugging

  useEffect(() => {
    if (user) {
      dispatch(fetchPosts());
    }
  }, [dispatch, user]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await dispatch(createPost({ caption: newPost.caption, imageFile: newPost.image, userId: user.id }));
    await dispatch(fetchPosts()); // Fetch posts immediately after creating
    setNewPost({ caption: '', image: null });
    setLoading(false);
  };

  const handleDeletePost = async (postId) => {
    await dispatch(deletePost({ postId, userId: user.id }));
    await dispatch(fetchPosts()); // Fetch posts immediately after deleting
  };

  const handleEditPost = (post) => {
    setEditingPost(post.id);
    setUpdatedPost({ caption: post.caption, image: null });
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    await dispatch(updatePost({
      postId: editingPost,
      updatedCaption: updatedPost.caption,
      updatedImage: updatedPost.image,
      userId: user.id,
    }));
    await dispatch(fetchPosts()); // Fetch posts immediately after updating
    setEditingPost(null);
    setUpdatedPost({ caption: '', image: null });
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="p-6 bg-[#fff5e6]">
        <h1 className="text-2xl font-bold text-center mb-6">My Posts</h1>

        {/* Add New Post */}
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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>

        {/* Display Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts
            .filter((post) => {
              console.log('Filtering posts:', { postUserId: post.user_id, loggedInUserId: user.id }); // Debugging
              return post.user_id === user.id;
            })
            .map((post) => (
              <div key={post.id} className="border rounded p-4 shadow">
                {editingPost === post.id ? (
                  <form onSubmit={handleUpdatePost}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setUpdatedPost({ ...updatedPost, image: e.target.files[0] })}
                      className="mb-4 border rounded w-full p-2"
                    />
                    <textarea
                      value={updatedPost.caption}
                      onChange={(e) => setUpdatedPost({ ...updatedPost, caption: e.target.value })}
                      placeholder="Update your caption..."
                      className="w-full p-2 border rounded mb-4"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      {loading ? 'Updating...' : 'Update'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingPost(null)}
                      className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <Image
                      src={post.image_url}
                      alt="Post Image"
                      width={300}
                      height={200}
                      className="rounded mb-4"
                    />
                    <p className="text-gray-700 mb-2">{post.caption}</p>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyPosts;