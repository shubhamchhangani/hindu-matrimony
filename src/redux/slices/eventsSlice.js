import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../utils/supabase/client';

export const fetchEvents = createAsyncThunk('events/fetchEvents', async () => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      profiles!events_admin_user_id_fkey (
        full_name
      )
    `)
    .order('date', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
});

export const createEvent = createAsyncThunk('events/createEvent', async (event) => {
  const { data, error } = await supabase
    .from('events')
    .insert([event]);

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
});

export const deleteEvent = createAsyncThunk('events/deleteEvent', async (id) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return id;
});

export const updateEvent = createAsyncThunk('events/updateEvent', async ({ id, updatedEvent }) => {
  const { error } = await supabase
    .from('events')
    .update(updatedEvent)
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return { id, updatedEvent };
});

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(event => event.id !== action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const { id, updatedEvent } = action.payload;
        const existingEvent = state.events.find(event => event.id === id);
        if (existingEvent) {
          Object.assign(existingEvent, updatedEvent);
        }
      });
  },
});

export default eventsSlice.reducer;