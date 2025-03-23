// redux/slices/profilesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../utils/supabase/client';

// Async thunk to fetch a single profile by ID
export const fetchProfile = createAsyncThunk(
  'profiles/fetchProfile',
  async (id, thunkAPI) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) return thunkAPI.rejectWithValue(error.message);
    return data;
  }
);

const profilesSlice = createSlice({
  name: 'profiles',
  initialState: {
    profile: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // You can add synchronous actions here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default profilesSlice.reducer;
