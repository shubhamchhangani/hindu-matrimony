// store.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer, { signOut } from './slices/authSlice';
import postsReducer from './slices/postsSlice';
import chatsReducer from './slices/chatsSlice';
import profilesReducer from './slices/profilesSlice';
import profileImagesReducer from './slices/profileImagesSlice';
import eventsReducer from './slices/eventsSlice';

const appReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  chats: chatsReducer,
  profiles: profilesReducer,
  profileImages: profileImagesReducer,
  events: eventsReducer,
});

// Root reducer that resets state on signOut
// Root reducer that resets state on signOut
const rootReducer = (state, action) => {
    if (action.type === signOut.fulfilled.type) {
      state = undefined; // Reset all state
    }
    return appReducer(state, action);
  };

export const store = configureStore({
  reducer: rootReducer,
});

export default store;
