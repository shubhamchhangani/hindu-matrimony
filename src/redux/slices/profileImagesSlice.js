import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../utils/supabase/client';

// Async thunk to fetch profile images
export const fetchProfileImages = createAsyncThunk(
  'profileImages/fetchProfileImages',
  async (profileId, { rejectWithValue }) => {
    if (!profileId) return rejectWithValue('profileId is undefined');
    try {
      const { data, error } = await supabase
        .from('profile_images')
        .select('*')
        .eq('profile_id', profileId);
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to upload a new profile image
export const uploadProfileImage = createAsyncThunk(
  'profileImages/uploadProfileImage',
  async ({ profileId, imageFile, imageType }, { rejectWithValue }) => {
    if (!profileId) return rejectWithValue('profileId is undefined');
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${profileId}/${imageType}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('userphotos') // Ensure this matches the bucket name in Supabase
        .upload(fileName, imageFile, { upsert: true });
      if (uploadError) throw uploadError;

      // Retrieve public URL
      const { data: urlData } = supabase.storage
        .from('userphotos')
        .getPublicUrl(fileName);
      const imageUrl = urlData.publicUrl;

      const { data, error } = await supabase
        .from('profile_images')
        .insert([{ profile_id: profileId, image_url: imageUrl, image_type: imageType }])
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete a profile image
export const deleteProfileImage = createAsyncThunk(
  'profileImages/deleteProfileImage',
  async ({ profileId, imageId }, { rejectWithValue }) => {
    if (!profileId || !imageId) return rejectWithValue('profileId or imageId is undefined');
    try {
      const { error } = await supabase
        .from('profile_images')
        .delete()
        .eq('id', imageId)
        .eq('profile_id', profileId);
      if (error) throw error;
      return imageId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to set a primary profile image
export const setPrimaryProfileImage = createAsyncThunk(
  'profileImages/setPrimaryProfileImage',
  async ({ profileId, imageId }, { rejectWithValue }) => {
    if (!profileId || !imageId) return rejectWithValue('profileId or imageId is undefined');
    try {
      // Reset all images' is_primary_profile to false
      await supabase
        .from('profile_images')
        .update({ is_primary_profile: false })
        .eq('profile_id', profileId);

      // Set the selected image's is_primary_profile to true
      const { data, error } = await supabase
        .from('profile_images')
        .update({ is_primary_profile: true })
        .eq('id', imageId)
        .eq('profile_id', profileId)
        .single();
      if (error) throw error;
      return { id: imageId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to set a primary house image
export const setPrimaryHouseImage = createAsyncThunk(
  'profileImages/setPrimaryHouseImage',
  async ({ profileId, imageId }, { rejectWithValue }) => {
    if (!profileId || !imageId) return rejectWithValue('profileId or imageId is undefined');
    try {
      // Reset all images' is_primary_house to false
      await supabase
        .from('profile_images')
        .update({ is_primary_house: false })
        .eq('profile_id', profileId);

      // Set the selected image's is_primary_house to true
      const { data, error } = await supabase
        .from('profile_images')
        .update({ is_primary_house: true })
        .eq('id', imageId)
        .eq('profile_id', profileId)
        .single();
      if (error) throw error;
      return { id: imageId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const profileImagesSlice = createSlice({
  name: 'profileImages',
  initialState: {
    images: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchProfileImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.images.push(action.payload);
      })
      .addCase(deleteProfileImage.fulfilled, (state, action) => {
        state.images = state.images.filter(
          (image) => image.id !== action.payload
        );
      })
      .addCase(setPrimaryProfileImage.fulfilled, (state, action) => {
        state.images = state.images.map((image) =>
          image.id === action.payload.id
            ? { ...image, is_primary_profile: true }
            : { ...image, is_primary_profile: false }
        );
      })
      .addCase(setPrimaryHouseImage.fulfilled, (state, action) => {
        state.images = state.images.map((image) =>
          image.id === action.payload.id
            ? { ...image, is_primary_house: true }
            : { ...image, is_primary_house: false }
        );
      });
  },
});

export default profileImagesSlice.reducer;
