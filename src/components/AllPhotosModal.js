"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { addProfileImage, deleteProfileImage } from '../redux/slices/profileImagesSlice';

const AllPhotosModal = ({ images, onClose, onSetPrimary, loadingPrimary, isOwner, onRefresh }) => {
  const dispatch = useDispatch();
  // Local state for new image upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [newImageType, setNewImageType] = useState('profile'); // 'profile' or 'house'
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  const handleAddImage = async () => {
    if (!selectedFile) {
      alert("Please select an image file.");
      return;
    }
    setUploading(true);
    try {
      // Dispatch the thunk to add the image. 
      // Here, we assume that all images for a profile have the same profile_id,
      // so we take it from the first image in the array.
      await dispatch(addProfileImage({ profileId: images[0]?.profile_id, file: selectedFile, imageType: newImageType }));
      setSelectedFile(null);
      if (onRefresh) await onRefresh();  // Refresh gallery after add
      alert("Image added successfully!");
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Error uploading image: " + err);
    }
    setUploading(false);
  };

  const handleDelete = async (img) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await dispatch(deleteProfileImage({ imageId: img.id, filePath: img.file_path || '' }));
      if (onRefresh) await onRefresh();  // Refresh gallery after deletion
      alert("Image deleted successfully!");
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Error deleting image: " + err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 overflow-auto">
      <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">All Photos</h2>
          <button onClick={onClose}>
            <XCircleIcon className="w-8 h-8 text-red-500" />
          </button>
        </div>
        {images.length === 0 ? (
          <p>No images available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative border rounded overflow-hidden">
                <div className="relative h-40 w-full">
                  <Image src={img.image_url} alt={img.image_type} fill className="object-cover" />
                </div>
                {isOwner && (
                  <div className="p-2 flex flex-col space-y-2">
                    <button
                      onClick={() => onSetPrimary(img.id, 'profile')}
                      disabled={loadingPrimary}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Set as Primary Profile
                    </button>
                    <button
                      onClick={() => onSetPrimary(img.id, 'house')}
                      disabled={loadingPrimary}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Set as Primary House
                    </button>
                    <button
                      onClick={() => handleDelete(img)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add new image functionality: Only show if owner */}
        {isOwner && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-xl font-bold mb-2">Add More Images</h3>
            <div className="mb-2">
              <label className="block mb-1 font-semibold">Select Image Type:</label>
              <select
                value={newImageType}
                onChange={(e) => setNewImageType(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="profile">Profile Image</option>
                <option value="house">House Image</option>
              </select>
            </div>
            <div className="mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border p-2 rounded w-full"
              />
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
