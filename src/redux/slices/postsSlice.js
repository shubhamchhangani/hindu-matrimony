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
      user_id,
      profiles!fk_posts_profiles (full_name),
      likes (id, user_id),
      comments (
        id,
        content,
        user_id,
        created_at,
        profiles (full_name)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) return thunkAPI.rejectWithValue(error.message);

  const processedPosts = data.map((post) => ({
    ...post,
    likes: post.likes || [],
    comments: (post.comments || []).map((comment) => ({
      ...comment,
      full_name: comment.profiles?.full_name || 'Unknown User',
    })),
    profile_picture: 'https://zrlzmigtsxfhfhedkqzy.supabase.co/storage/v1/object/public/assets//avatar.jpg',
  }));

  return processedPosts;
});

// Async thunk to create a new post with image upload
export const createPost = createAsyncThunk(
  'posts/createPost',
  async ({ caption, imageFile, userId }, thunkAPI) => {
    try {
      let imageUrl = '';
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // Get the full public URL of the uploaded image
        const { data: urlData, error: urlError } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);

        if (urlError) throw urlError;

        imageUrl = urlData.publicUrl;
      }

      // Insert the new post into the database
      const { data, error } = await supabase
        .from('posts')
        .insert({ user_id: userId, caption, image_url: imageUrl })
        .select(); // Use `select()` to return the inserted row

      if (error) throw error;

      // Return the newly created post
      return data[0];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
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
    try {
      // Delete the post from the database
      const { error } = await supabase
        .from('posts')
        .delete()
        .match({ id: postId, user_id: userId });

      if (error) throw error;

      // Return the deleted post ID
      return { postId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
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

// Update a post
export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, updatedCaption, updatedImage, userId }, thunkAPI) => {
    try {
      let imageUrl = null;

      // If a new image is provided, upload it
      if (updatedImage) {
        const fileExt = updatedImage.name.split('.').pop();
        const fileName = `${userId}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, updatedImage);

        if (uploadError) throw uploadError;

        const { data: urlData, error: urlError } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);

        if (urlError) throw urlError;

        imageUrl = urlData.publicUrl;
      }

      // Update the post in the database
      const { error } = await supabase
        .from('posts')
        .update({
          caption: updatedCaption || undefined,
          image_url: imageUrl || undefined,
        })
        .eq('id', postId);

      if (error) throw error;

      // Return the updated post details
      return { postId, updatedCaption, imageUrl };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
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
      })
      // Update Post
      .addCase(updatePost.fulfilled, (state, action) => {
        const { postId, updatedCaption, imageUrl } = action.payload;
        const post = state.posts.find((post) => post.id === postId);
        if (post) {
          if (updatedCaption) post.caption = updatedCaption;
          if (imageUrl) post.image_url = imageUrl;
        }
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload); // Add the new post to the top of the list
        state.status = 'succeeded';
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default postsSlice.reducer;
