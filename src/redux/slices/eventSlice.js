import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../utils/supabase/client';

// Thunk to fetch all events
export const fetchEvents = createAsyncThunk('events/fetchEvents', async (_, thunkAPI) => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      id,
      title,
      description,
      date,
      image_url,
      created_at,
      admin_user_id,
      profiles!events_admin_user_id_fkey (full_name)
    `)
    .order('date', { ascending: true });

  if (error) {
    return thunkAPI.rejectWithValue(error.message);
  }

  return data;
});

// Thunk to create a new event
export const createEvent = createAsyncThunk('events/createEvent', async (eventData, thunkAPI) => {
  const { title, description, date, image_url, admin_user_id } = eventData; // Only include valid fields

  const { data, error } = await supabase
    .from('events')
    .insert([{ title, description, date, image_url, admin_user_id }]); // Ensure only valid fields are sent

  if (error) {
    return thunkAPI.rejectWithValue(error.message); // Handle errors gracefully
  }

  return data[0]; // Return the created event
});

// Thunk to delete an event
export const deleteEvent = createAsyncThunk('events/deleteEvent', async (eventId, thunkAPI) => {
  const { error } = await supabase.from('events').delete().eq('id', eventId);

  if (error) {
    return thunkAPI.rejectWithValue(error.message);
  }

  return eventId;
});

// Thunk to update an event
export const updateEvent = createAsyncThunk('events/updateEvent', async ({ id, updatedEvent }, thunkAPI) => {
  const { data, error } = await supabase
    .from('events')
    .update(updatedEvent)
    .eq('id', id);

  if (error) {
    return thunkAPI.rejectWithValue(error.message);
  }

  return data[0];
});

// Event slice
const eventSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create event
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete event
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((event) => event.id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update event
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((event) => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;