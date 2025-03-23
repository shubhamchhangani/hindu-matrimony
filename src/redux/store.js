// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postsReducer from './slices/postsSlice';
import chatsReducer from './slices/chatsSlice';
import profilesReducer from './slices/profilesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    chats: chatsReducer,
    profiles: profilesReducer,
  },
});

export default store;
