// redux/slices/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../utils/supabase/client';

// Async thunk to fetch posts with related profiles, likes, and comments
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, thunkAPI) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      caption,
      image_url,
      created_at,
      profiles!fk_posts_profiles (id, full_name, profile_picture),
      likes (id, user_id),
      comments (id, content, user_id, created_at, profiles!comments_user_id_fkey (full_name))
    `)
    .order('created_at', { ascending: false });
  if (error) return thunkAPI.rejectWithValue(error.message);
  return data;
});

// Async thunk to create a new post with image upload
export const createPost = createAsyncThunk(
  'posts/createPost',
  async ({ caption, imageFile, userId }, thunkAPI) => {
    let imageUrl = '';
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('posts')
        .upload(fileName, imageFile);
      if (uploadError) return thunkAPI.rejectWithValue(uploadError.message);
      imageUrl = uploadData.path;
    }
    const { data, error } = await supabase
      .from('posts')
      .insert({ user_id: userId, caption, image_url: imageUrl });
    if (error) return thunkAPI.rejectWithValue(error.message);
    // Return the newly created post (assuming data is returned as an array)
    return data[0];
  }
);

// Async thunk to like a post
export const likePost = createAsyncThunk(
  'posts/likePost',
  async ({ postId, userId }, thunkAPI) => {
    const { data, error } = await supabase
      .from('likes')
      .insert([{ post_id: postId, user_id: userId }]);
    if (error) return thunkAPI.rejectWithValue(error.message);
    return { postId, like: data[0] };
  }
);

// Async thunk to unlike a post
export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async ({ postId, userId }, thunkAPI) => {
    const { data, error } = await supabase
      .from('likes')
      .delete()
      .match({ post_id: postId, user_id: userId });
    if (error) return thunkAPI.rejectWithValue(error.message);
    return { postId, userId };
  }
);

// Async thunk to delete a post
export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async ({ postId, userId }, thunkAPI) => {
    const { data, error } = await supabase
      .from('posts')
      .delete()
      .match({ id: postId, user_id: userId });
    if (error) return thunkAPI.rejectWithValue(error.message);
    return { postId };
  }
);

// Async thunk to add a comment to a post
export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, userId, content }, thunkAPI) => {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, user_id: userId, content }]);
    if (error) return thunkAPI.rejectWithValue(error.message);
    return { postId, comment: data[0] };
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create Post
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, like } = action.payload;
        const post = state.posts.find((post) => post.id === postId);
        if (post) {
          post.likes.push(like);
        }
      })
      // Unlike Post
      .addCase(unlikePost.fulfilled, (state, action) => {
        const { postId, userId } = action.payload;
        const post = state.posts.find((post) => post.id === postId);
        if (post) {
          post.likes = post.likes.filter((like) => like.user_id !== userId);
        }
      })
      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload.postId);
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const post = state.posts.find((post) => post.id === postId);
        if (post) {
          post.comments.push(comment);
        }
      });
  },
});

export default postsSlice.reducer;
