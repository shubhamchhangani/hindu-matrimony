// redux/slices/profileImagesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../utils/supabase/client';

// Fetch all images for a given profile from the new profile_images table
export const fetchProfileImages = createAsyncThunk(
  'profileImages/fetchProfileImages',
  async (profileId, thunkAPI) => {
    const { data, error } = await supabase
      .from('profile_images')
      .select('*')
      .eq('profile_id', profileId);
    if (error) {
      console.error("Error fetching images:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
    return data;
  }
);

// Add a new image (with imageType: 'profile' or 'house')
export const addProfileImage = createAsyncThunk(
  'profileImages/addProfileImage',
  async ({ profileId, file, imageType }, thunkAPI) => {
    const fileExt = file.name.split('.').pop();
    // Generate a unique filename; using timestamp so multiple images can coexist
    const fileName = `${profileId}/${imageType}_${Date.now()}.${fileExt}`;
    
    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('userphotos')
      .upload(fileName, file);
    if (uploadError) return thunkAPI.rejectWithValue(uploadError.message);
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabase
      .storage
      .from('userphotos')
      .getPublicUrl(fileName);
    const imageUrl = urlData.publicUrl;
    
    // Insert a new record into profile_images table
    const { data, error } = await supabase
      .from('profile_images')
      .insert([{ profile_id: profileId, image_type, image_url: imageUrl, file_path: fileName }]);
    if (error) return thunkAPI.rejectWithValue(error.message);
    return data[0];
  }
);

// Update an existing image by re-uploading a file
export const updateProfileImage = createAsyncThunk(
  'profileImages/updateProfileImage',
  async ({ imageId, profileId, file, imageType }, thunkAPI) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${profileId}/${imageType}_${Date.now()}.${fileExt}`;
    
    // Upload new file with upsert so it replaces the old file
    const { error: uploadError } = await supabase
      .storage
      .from('userphotos')
      .upload(fileName, file, { upsert: true });
    if (uploadError) return thunkAPI.rejectWithValue(uploadError.message);
    
    const { data: urlData } = supabase
      .storage
      .from('userphotos')
      .getPublicUrl(fileName);
    const imageUrl = urlData.publicUrl;
    
    // Update the record with the new URL and file_path
    const { data, error } = await supabase
      .from('profile_images')
      .update({ image_url: imageUrl, file_path: fileName })
      .eq('id', imageId);
    if (error) return thunkAPI.rejectWithValue(error.message);
    return data[0];
  }
);

// Delete an image record (and remove the file from storage)
export const deleteProfileImage = createAsyncThunk(
  'profileImages/deleteProfileImage',
  async ({ imageId, filePath }, thunkAPI) => {
    // Remove file from storage. filePath should be stored in the record.
    const { error: removeError } = await supabase
      .storage
      .from('userphotos')
      .remove([filePath]);
    if (removeError) return thunkAPI.rejectWithValue(removeError.message);
    
    // Delete record from profile_images table
    const { data, error } = await supabase
      .from('profile_images')
      .delete()
      .eq('id', imageId);
    if (error) return thunkAPI.rejectWithValue(error.message);
    return imageId;
  }
);

const profileImagesSlice = createSlice({
  name: 'profileImages',
  initialState: {
    images: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileImages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfileImages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.images = action.payload;
      })
      .addCase(fetchProfileImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addProfileImage.fulfilled, (state, action) => {
        state.images.push(action.payload);
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        const index = state.images.findIndex(img => img.id === action.payload.id);
        if (index !== -1) state.images[index] = action.payload;
      })
      .addCase(deleteProfileImage.fulfilled, (state, action) => {
        state.images = state.images.filter(img => img.id !== action.payload);
      });
  },
});

export default profileImagesSlice.reducer;
