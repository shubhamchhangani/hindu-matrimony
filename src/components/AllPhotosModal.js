'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProfileImages,
  uploadProfileImage,
  deleteProfileImage,
  setPrimaryProfileImage,
  setPrimaryHouseImage,
} from '../redux/slices/profileImagesSlice';

const AllPhotosModal = ({ profileId, onClose, isOwner }) => {
  const dispatch = useDispatch();
  const { images, status } = useSelector((state) => state.profileImages);

  // Fetch images on component mount
  useEffect(() => {
    if (profileId) {
      dispatch(fetchProfileImages(profileId));
    }
  }, [dispatch, profileId]);

  // Local state for new image upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageType, setImageType] = useState('profile'); // 'profile' or 'house'
  const [uploading, setUploading] = useState(false);
  const [loadingPrimary, setLoadingPrimary] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  // Upload new image
  const handleAddImage = async () => {
    if (!selectedFile) {
      alert('Please select an image file.');
      return;
    }
    setUploading(true);
    try {
      await dispatch(uploadProfileImage({ profileId, imageFile: selectedFile, imageType })).unwrap();
      dispatch(fetchProfileImages(profileId)); // Refresh images
      setSelectedFile(null);
      alert('Image added successfully!');
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Error uploading image: ' + err.message);
    }
    setUploading(false);
  };

  // Delete an image
  const handleDelete = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      await dispatch(deleteProfileImage({ profileId, imageId })).unwrap();
      dispatch(fetchProfileImages(profileId)); // Refresh images
      alert('Image deleted successfully!');
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Error deleting image: ' + err.message);
    }
  };

  // Set primary profile image
  const handleSetPrimaryProfile = async (imageId) => {
    setLoadingPrimary(true);
    try {
      await dispatch(setPrimaryProfileImage({ profileId, imageId })).unwrap();
      dispatch(fetchProfileImages(profileId)); // Refresh images
      alert('Primary profile image updated!');
    } catch (err) {
      console.error('Error setting primary profile image:', err);
    }
    setLoadingPrimary(false);
  };

  // Set primary house image
  const handleSetPrimaryHouse = async (imageId) => {
    setLoadingPrimary(true);
    try {
      await dispatch(setPrimaryHouseImage({ profileId, imageId })).unwrap();
      dispatch(fetchProfileImages(profileId)); // Refresh images
      alert('Primary house image updated!');
    } catch (err) {
      console.error('Error setting primary house image:', err);
    }
    setLoadingPrimary(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 overflow-auto py-10">
      <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4 shadow-xl border border-red-600">
        <div className="flex justify-between items-center mb-4 relative">
          <h2 className="text-xl md:text-2xl font-bold text-red-700">All Photos</h2>
          <button
            onClick={onClose}
            className="absolute top-0 right-0 md:top-4 md:right-4 p-2"
          >
            <XCircleIcon
              className="w-8 h-8 md:w-10 md:h-10 text-red-500 hover:text-red-700 transition-colors"
            />
          </button>
        </div>

        {/* Image Grid */}
        {images.length === 0 ? (
          <p className="text-gray-600 text-center">No images available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
            {images.map((img) => (
              img && img.image_url ? ( // Ensure img exists and has image_url
                <div key={img.id} className="relative border rounded overflow-hidden shadow-lg">
                  <div className="relative h-40 w-full">
                    <Image src={img.image_url} alt="User Image" fill className="object-cover rounded" />
                  </div>
                  <div className="p-2">
                    <p className="text-sm text-gray-600">Added: {img.created_at ? new Date(img.created_at).toLocaleDateString() : 'N/A'}</p>
                    {img.is_primary_profile && (
                      <p className="text-green-600 font-bold">Primary Profile Photo</p>
                    )}
                    {img.is_primary_house && (
                      <p className="text-blue-600 font-bold">Primary House Photo</p>
                    )}
                    {isOwner && (
                      <div className="mt-2 flex flex-col space-y-2">
                        <button
                          onClick={() => handleSetPrimaryProfile(img.id)}
                          disabled={loadingPrimary}
                          className="px-2 py-1 text-sm md:text-base bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Set as Primary Profile
                        </button>
                        <button
                          onClick={() => handleSetPrimaryHouse(img.id)}
                          disabled={loadingPrimary}
                          className="px-2 py-1 text-sm md:text-base bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Set as Primary House
                        </button>
                        <button
                          onClick={() => handleDelete(img.id)}
                          className="px-2 py-1 text-sm md:text-base bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : null // Skip rendering if img is null or doesn't have image_url
            ))}
          </div>
        )}

        {/* Add new image functionality */}
        {isOwner && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-xl font-bold text-red-700 mb-2">Add More Images</h3>
            <div className="mb-2">
              <label className="block mb-1 font-semibold text-gray-700">Select Image Type:</label>
              <select
                value={imageType}
                onChange={(e) => setImageType(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="profile">Profile Image</option>
                <option value="house">House Image</option>
              </select>
            </div>
            <div className="mb-2">
              <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded w-full" />
            </div>
            <button
              onClick={handleAddImage}
              disabled={uploading}
              className="w-full p-3 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              {uploading ? 'Uploading...' : 'Add Image'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPhotosModal;
