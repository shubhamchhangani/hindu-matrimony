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
      profile_images!fk_posts_profile_images (
        profile_id,
        image_url,
        is_primary_profile
      ),
      likes (id, user_id),
      comments (id, content, user_id, created_at)
    `)
    .order('created_at', { ascending: false });

  if (error) return thunkAPI.rejectWithValue(error.message);

  // Process posts to include the primary profile photo or a default avatar
  const processedPosts = data.map((post) => {
    const primaryProfileImage = post.profile_images?.find((img) => img.is_primary_profile);
    return {
      ...post,
      profile_picture: primaryProfileImage?.image_url || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAgVBMVEX9//4Zt9L///8AAACJiYkAtNAAss8AsM74/f3i9Pj0+/zw+vyS1+Xd8vbr9/poyt44vNW45e7P7fOF0+OoqKhzc3NpaWl6z+DF6vGu4etbxdpGwNc3NzcJCQmVlZWfn59hYWEiIiJVVVWf3OhBQUEVFRUtLS27u7vm5uZMTEx8fHwh/npRAAAGp0lEQVR4nO3ca3uiOhAAYJg2ARS5VkFYa7fsnj27//8HbqBWUUkyM4QeP5x5nr0UQ3iNIeRmPWCERwlO/ouCmC7iCRwSnUVKziVRWYTEc0g0FjrpXBKFhUzogoRnoZK5ImFVX41CsexpnIpwKmsS5yYEy5ZgCZNVZXl9GZONZXx1MZJFZXpxSZNRZXhtWZNJpX9paZNBpX1leZNepXuBm7cTleY4KduwyONKRdzVCRFGQeHz3NRVFgRSCDn8CWSzL0Lim8Kh0BkqkRD+VQjpNx3pfblEQZi38kZ0CinKBP/OcChcXpv0tpDGrKzDFhYOhcopjDWldP4Y24Kt4qFg05hJvcrfYyuCHYXJpfatpp5VrXiq+wOIPPYYUl+z0jWygppRmCxypEmVFU9FRxFMfVmFDNXtj/bTI4JJqeLZKMTZSUYxqU9wT1eRURWpoHoVqlrpUYhz64Bo8kWzQqA8PgrWLdWkVDW1qDyKyYOO+uENQa1VJBSEHJIvUXV9GoU4by9Zqgb1uGGiQkaNGoJYqygoKJgmUdFqlUcoKIhZ1bxXhTwU4qTQ3onSRIDr8DFQkPCquQpZLoait+bnaEi9PQ9tUlWKXVJ+hhvdMFApt0qpIFUqCorbSvWBaqk+VQSUR+xJXUXOKCnMCasZKGRXz3t4FCr9V6A8Kipcvk6RUR7MQTHuPtwJzQwUabaDgir5jWcWUearKKic/+xrkaQRCpk8Yj/7REqabiSgPH6bEGBvPjqKX6kkcqKKg8qZJoHsTrFQnPHxgMK25wyU+vx4VR3fIFxQ+BN4vXSBm6O6qEgoDyqOKsBXcxYqYrQKoqOuidFQavBAb9Vb9JIIE6W6CtS2SiI7CHNQ1PkEiZtHmIWiTgeJBjeTPg9FuwMFchQ6F+WF+Alige7czUUBuqxEtqGv2vNQagiBe9xwTbRn3+XMPWJtLUCuFrlCqZYhs7SiQsa4tSJ3KHVanBk+QyEaQs/AFapfsq2EjhVkNauYZqPUmUl5ty3hY2NC7bH3ysxE9Rms92Um5XnhXUjpp13Bz5E87tNksd7kZdpmfTRVVySUTSXTprmocz4A4enfWXk5QzmNEepxVI9eUvQzkenmoIid6DDHjE8A8g25C8lDgVeUIvBr6zmwqgLZ5mvawGSMwk9p1aeHi+VxqxK2om9N23hFGIIzUKqUms/nimhz/bMEICo/Ozcii9GlRUcBFFVwedSJIM2nTwTYdP7oWS3bPfJZeIPCLLXHNz074Tfd+vpWHJr2orrtAopmg3zfJJSqIxPDUCFFui8iOMdKPQiziY1xqsuHuGGBhrovplFPJWvSMu66OK6aNvM12wdlY++w01AQtcahgui7L9KydVBaa9YdypR+8qOjh6jM7x3uUYb0e/4E+lVIc8edguJvR7gLkRlGXUBBlY7K6UOlH8dPoqZTcydftSrdjAdMoyZbZ8bUnVnVauoVHsXcxWVWTTajgEZB4dw0zO1NvX0d6jYtRO5J/vS8OmBRsGJvA7Ko7m5BMKCu0zq+8UYo//YWRKMWqVAnVWUyGTY0QzJnb4sl5PWqpAV1SQvdQh9eHyIbd/HvDLcH4FxQjlvN65CjBZt7wt0R+Kzli9WoIS6PmwnB/aEhMWwWJY226U0BdCjyFm+y6vS0QaKgbzcXrVF9nNr1yetPHYRZmwKxMawDai4/Gas5m22QIXLtF/mmDy/XmI9QzfS1taiwWrxO+X4QTl9c/53Rxe++YcRFRDkdL0xFUOoKyvQ9ZHcjq6kQpf7KBhT6e2As095wYRMK+Y05DqmfnmSiYNMuopLtxnhZMwqSOTurdSHSxHxVCwpQC7M0km+qTjgUFKYVUHrIrLBe0o5SbYO7whJ+jLggBqXqu6OGNLDUcAoKIHcxlSeyHHc1JAqSzjKjaSeJznLTkVEA63hOaYmsXKMvhUcBRLFth4QugiyO7PmzUP3ieku/E4Xf7vGlREepqOOpFQW9SGax8TnnBKXqfJ0KYfi1BBeQirTG1u55qD7qOM2EqcSElFlKL6NZKDXeiYo4FcOv3xiXWv+TDAKRxkW04ubNRn1E/4tKyjRt2mELR9s2aVrFeaHt6H4J6iMPb5UkkYokWWmGl8QMHeThPP5HYcN7fsDwnh4wHhp1GB/8+R9AxjGgXp52u+Gn7fD37vj67cfwv5/P19ovRf3za/u6ez3u/v398rp7+bV9P77sXrZ/jtvj9puDi2zfvh8Ohzf1BnfPO/W/p7fD02GIp/fv2x+vb8e31/fn9+ftn+1QLH8Bloh9bG3nbi4AAAAASUVORK5CYII=', // Default avatar
    };
  });

  return processedPosts;
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
        .from('post-images')
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
