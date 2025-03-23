// slices/chatsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../utils/supabase/client';

// Async thunk to fetch existing chats
export const fetchChats = createAsyncThunk('chats/fetchChats', async () => {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
});

const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    messages: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addMessage(state, action) {
      state.messages.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addMessage } = chatsSlice.actions;
export default chatsSlice.reducer;
