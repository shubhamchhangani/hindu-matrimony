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
  const [editingPost, setEditingPost] = useState(null);
  const [updatedPost, setUpdatedPost] = useState({ caption: '', image: null });

  useEffect(() => {
    if (user) {
      dispatch(fetchPosts());
    }
  }, [dispatch, user]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await dispatch(createPost({ caption: newPost.caption, imageFile: newPost.image, userId: user.id }));
    await dispatch(fetchPosts());
    setNewPost({ caption: '', image: null });
    setLoading(false);
  };

  const handleDeletePost = async (postId) => {
    await dispatch(deletePost({ postId, userId: user.id }));
    await dispatch(fetchPosts());
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
    await dispatch(fetchPosts());
    setEditingPost(null);
    setUpdatedPost({ caption: '', image: null });
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="p-6 bg-[#fff5e6] min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-8">My Posts</h1>

        {/* Add New Post */}
        <form onSubmit={handlePostSubmit} className="mb-10 p-6 bg-white rounded-lg shadow-2xl max-w-xl mx-auto">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewPost({ ...newPost, image: e.target.files[0] })}
            className="mb-4 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            value={newPost.caption}
            onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
            placeholder="Write your caption..."
            className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg transition transform hover:scale-105 hover:bg-blue-600 focus:outline-none"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>

        {/* Display Posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.filter((post) => post.user_id === user.id).map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-2xl overflow-hidden">
              {editingPost === post.id ? (
                <form onSubmit={handleUpdatePost} className="p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUpdatedPost({ ...updatedPost, image: e.target.files[0] })}
                    className="mb-4 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <textarea
                    value={updatedPost.caption}
                    onChange={(e) => setUpdatedPost({ ...updatedPost, caption: e.target.value })}
                    placeholder="Update your caption..."
                    className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <div className="flex justify-between">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-500 text-white py-2 px-4 rounded-lg transition transform hover:scale-105 hover:bg-green-600 focus:outline-none"
                    >
                      {loading ? 'Updating...' : 'Update'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingPost(null)}
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg transition transform hover:scale-105 hover:bg-gray-600 focus:outline-none"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="relative w-full h-56">
                    <Image
                      src={post.image_url}
                      alt="Post Image"
                      layout="fill"
                      objectFit="cover"
                      className="transition transform hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-gray-800 mb-4">{post.caption}</p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="bg-yellow-500 text-white py-2 px-4 rounded-lg transition transform hover:scale-105 hover:bg-yellow-600 focus:outline-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg transition transform hover:scale-105 hover:bg-red-600 focus:outline-none"
                      >
                        Delete
                      </button>
                    </div>
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