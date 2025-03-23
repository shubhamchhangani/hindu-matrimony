// slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../utils/supabase/client';

// Async thunk for signing in
export const signIn = createAsyncThunk('auth/signIn', async ({ email, password }, thunkAPI) => {
    console.log("signing in from redux toolkit and authSlice")
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return thunkAPI.rejectWithValue(error.message);
  return data.user;
});

// Async thunk for signing up
export const signUp = createAsyncThunk('auth/signUp', async ({ email, password, full_name }, thunkAPI) => {
  const { data, error } = await supabase.auth.signUp(
    { email, password },
    { data: { full_name } }
  );
  if (error) return thunkAPI.rejectWithValue(error.message);
  return data.user;
});

// Async thunk for signing out
export const signOut = createAsyncThunk('auth/signOut', async (_, thunkAPI) => {
  const { error } = await supabase.auth.signOut();
  if (error) return thunkAPI.rejectWithValue(error.message);
  return null;
});

// Thunk to load user session on app startup
export const loadUser = createAsyncThunk('auth/loadUser', async (_, thunkAPI) => {
    const { data, error } = await supabase.auth.getSession();
    if (error) return thunkAPI.rejectWithValue(error.message);
    // data.session may be null if no user is signed in
    return data.session?.user || null;
  });


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    // Optional: synchronous actions if needed
  },
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Sign Out
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
      })
      // Load User Session
      .addCase(loadUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
