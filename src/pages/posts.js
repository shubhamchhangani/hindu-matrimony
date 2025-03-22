import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../utils/supabase/client';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';

export default function Posts() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ caption: '', image: null });
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/signin"); // Redirect to Signin page
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      checkProfile();
      fetchPosts();
    }
  }, [user]);

  async function checkProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      await supabase.from('profiles').insert([{ id: user.id, full_name: user.email }]);
    }
  }

  async function fetchPosts() {
    try {
        const { data, error } = await supabase
  .from('posts')
  .select(`
    id,
    caption,
    image_url,
    created_at,
    profiles!fk_posts_profiles (id, full_name, profile_picture),
    likes (id, user_id),
    comments (
      id,
      content,
      user_id,
      created_at,
      profiles!comments_user_id_fkey (full_name)
    )
  `)
  .order('created_at', { ascending: false });

if (error) {
  console.error('Error fetching posts:', error);
  return;
}

      
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  }

  async function handlePostSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      if (newPost.image) {
        const fileExt = newPost.image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage.from('posts').upload(fileName, newPost.image);
        if (error) throw error;
        imageUrl = data.path;
      }

      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        caption: newPost.caption,
        image_url: imageUrl,
      });

      if (error) throw error;
      setNewPost({ caption: '', image: null });
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(postId) {
    const post = posts.find(p => p.id === postId);
    const isLiked = post.likes.some(like => like.user_id === user.id);

    if (isLiked) {
      await supabase.from('likes').delete().match({ user_id: user.id, post_id: postId });
    } else {
      await supabase.from('likes').insert([{ user_id: user.id, post_id: postId }]);
    }
    fetchPosts();
  }

  async function handleComment(postId, content) {
    await supabase.from('comments').insert([{ user_id: user.id, post_id: postId, content }]);
    setComments({ ...comments, [postId]: '' });
    fetchPosts();
  }

  async function handleDeletePost(postId) {
    await supabase.from('posts').delete().match({ id: postId, user_id: user.id });
    fetchPosts();
  }

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handlePostSubmit} className="mb-8 p-4 bg-white rounded-lg shadow">
          <input type="file" accept="image/*" onChange={(e) => setNewPost({ ...newPost, image: e.target.files[0] })} />
          <textarea value={newPost.caption} onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })} placeholder="Write your caption..." />
          <button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post'}</button>
        </form>

        <div className="space-y-8">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <Image src={post.profiles.profile_picture || '/default-avatar.png'} width={40} height={40} className="rounded-full" alt={post.profiles.full_name} />
                <span className="ml-2 font-semibold">{post.profiles.full_name}</span>
                {post.user_id === user.id && <button onClick={() => handleDeletePost(post.id)}>Delete</button>}
              </div>
              <Image src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/${post.image_url}`} width={500} height={500} alt="Post" />
              <button onClick={() => handleLike(post.id)}>{post.likes.some(like => like.user_id === user.id) ? '♥' : '♡'} {post.likes.length} likes</button>
              <p>{post.caption}</p>
              <div>
                {post.comments.map(comment => (
                  <div key={comment.id}>
                    <span>{comment.profiles.full_name}:</span> {comment.content}
                  </div>
                ))}
              </div>
              <input type="text" value={comments[post.id] || ''} onChange={(e) => setComments({ ...comments, [post.id]: e.target.value })} />
              <button onClick={() => handleComment(post.id, comments[post.id])}>Post</button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
