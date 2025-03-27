import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import supabase from '../utils/supabase/client';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [newPostImage, setNewPostImage] = useState(null);
  const [newPostCaption, setNewPostCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeAgo, setTimeAgo] = useState({}); // Store time differences for posts

  // Get the logged-in user from Redux
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  useEffect(() => {
    // Calculate time differences for posts on the client side
    const calculateTimeAgo = () => {
      const now = Date.now();
      const timeAgoMap = {};
      posts.forEach((post) => {
        const timeDifference = Math.floor((now - new Date(post.created_at)) / (1000 * 60));
        timeAgoMap[post.id] = timeDifference;
      });
      setTimeAgo(timeAgoMap);
    };

    calculateTimeAgo();
  }, [posts]);

  // Fetch all posts of the user
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('id, image_url, caption, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error.message);
    } else {
      setPosts(data);
    }
  };

  // Handle new post submission
  const handleAddPost = async () => {
    if (!newPostImage || !newPostCaption) {
      alert('Please provide both an image and a caption.');
      return;
    }

    setLoading(true);

    try {
      // Upload the image to Supabase storage
      const fileExt = newPostImage.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, newPostImage);

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded image
      const { data: urlData, error: urlError } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      if (urlError) throw urlError;

      const publicUrl = urlData.publicUrl;

      // Insert the new post into the database
      const { error: insertError } = await supabase
        .from('posts')
        .insert([{ user_id: user.id, image_url: publicUrl, caption: newPostCaption }]);

      if (insertError) throw insertError;

      alert('Post added successfully!');
      setNewPostImage(null);
      setNewPostCaption('');
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error adding post:', error.message);
      alert('Error adding post.');
    } finally {
      setLoading(false);
    }
  };

  // Handle post deletion
  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      // Delete all comments and likes associated with the post
      await supabase.from('comments').delete().eq('post_id', postId);
      await supabase.from('likes').delete().eq('post_id', postId);

      // Delete the post itself
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) throw error;

      alert('Post deleted successfully!');
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error deleting post:', error.message);
      alert('Error deleting post.');
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const { error } = await supabase.from('comments').delete().eq('id', commentId);
      if (error) throw error;

      alert('Comment deleted successfully!');
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error deleting comment:', error.message);
      alert('Error deleting comment.');
    }
  };

  // Handle post update
  const handleUpdatePost = async (postId, updatedImage, updatedCaption) => {
    setLoading(true);

    try {
      let imageUrl = null;

      // If a new image is provided, upload it
      if (updatedImage) {
        const fileExt = updatedImage.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, updatedImage);

        if (uploadError) throw uploadError;

        const { publicURL } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);

        imageUrl = publicURL;
      }

      // Update the post in the database
      const { error } = await supabase
        .from('posts')
        .update({
          image_url: imageUrl || undefined,
          caption: updatedCaption || undefined,
        })
        .eq('id', postId);

      if (error) throw error;

      alert('Post updated successfully!');
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error updating post:', error.message);
      alert('Error updating post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">My Posts</h1>

        {/* Add New Post */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Post</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewPostImage(e.target.files[0])}
            className="block mb-4"
          />
          <textarea
            placeholder="Enter caption"
            value={newPostCaption}
            onChange={(e) => setNewPostCaption(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={handleAddPost}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {loading ? 'Adding...' : 'Add Post'}
          </button>
        </div>

        {/* Display Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="border rounded p-4 shadow">
              <Image
                src={post.image_url}
                alt="Post Image"
                width={300}
                height={200}
                className="rounded mb-4"
              />
              <p className="text-gray-700 mb-2">{post.caption}</p>
              <p className="text-sm text-gray-500">
                Published {timeAgo[post.id] || 0} minutes ago
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleUpdatePost(post.id, null, prompt('Enter new caption:'))}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Update Caption
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete Post
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyPosts;