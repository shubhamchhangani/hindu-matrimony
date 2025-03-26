// components/ProfileImagesManager.js
'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  fetchProfileImages,
  addProfileImage,
  updateProfileImage,
  deleteProfileImage,
} from '../redux/slices/profileImagesSlice';

const ProfileImagesManager = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileId = searchParams.get('uid');
  const dispatch = useDispatch();
  const { images, status, error } = useSelector(state => state.profileImages);

  // For adding a new image
  const [newFile, setNewFile] = useState(null);
  const [newImageType, setNewImageType] = useState('profile'); // 'profile' or 'house'

  // For updating an image
  const [updateFile, setUpdateFile] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [selectedImageType, setSelectedImageType] = useState('profile'); // for update action

  useEffect(() => {
    if (profileId) {
      dispatch(fetchProfileImages(profileId));
    }
  }, [profileId, dispatch]);

  // Handlers for adding a new image
  const handleNewFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setNewFile(file);
    }
  };

  const handleAddImage = async () => {
    if (!newFile) {
      alert("Please select an image file.");
      return;
    }
    try {
      await dispatch(addProfileImage({ profileId, file: newFile, imageType: newImageType }));
      setNewFile(null);
    } catch (err) {
      console.error("Error adding image:", err);
    }
  };

  // Handlers for updating an image
  const handleUpdateFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUpdateFile(file);
    }
  };

  const handleUpdateImage = async () => {
    if (!selectedImageId || !updateFile) {
      alert("Please select an image to update and choose a new file.");
      return;
    }
    try {
      await dispatch(updateProfileImage({
        imageId: selectedImageId,
        profileId,
        file: updateFile,
        imageType: selectedImageType,
      }));
      setUpdateFile(null);
      setSelectedImageId(null);
    } catch (err) {
      console.error("Error updating image:", err);
    }
  };

  // Handler for deleting an image
  const handleDeleteImage = async (img) => {
    // Note: You must store the relative file path in your DB or derive it.
    // For example, if the file was uploaded with name: `${profileId}/${img.image_type}_${timestamp}.${ext}`,
    // you might need to reconstruct it. Here we assume that your record has a property file_path.
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        await dispatch(deleteProfileImage({ imageId: img.id, filePath: img.file_path || '' }));
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow my-4">
      <h2 className="text-xl font-bold mb-4">Manage Your Images</h2>

      {/* Add New Image */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">
          Add New Image:
        </label>
        <select
          value={newImageType}
          onChange={(e) => setNewImageType(e.target.value)}
          className="border p-1 rounded mb-2"
        >
          <option value="profile">Profile</option>
          <option value="house">House</option>
        </select>
        <input type="file" accept="image/*" onChange={handleNewFileChange} className="block mb-2" />
        <button onClick={handleAddImage} className="px-4 py-2 bg-green-500 text-white rounded">
          Add Image
        </button>
      </div>

      {/* List Existing Images */}
      <div>
        <h3 className="font-semibold mb-2">Your Images:</h3>
        {status === 'loading' && <p>Loading images...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map(img => (
            <div key={img.id} className="border p-2 rounded relative">
              <div className="relative h-40 w-full">
                <Image src={img.image_url} alt={img.image_type} fill className="object-cover rounded" />
              </div>
              <div className="mt-2 flex justify-between">
                <button
                  onClick={() => {
                    setSelectedImageId(img.id);
                    setSelectedImageType(img.image_type);
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteImage(img)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Image Form */}
      {selectedImageId && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-semibold mb-2">Update Selected Image</h3>
          <input type="file" accept="image/*" onChange={handleUpdateFileChange} className="mb-2" />
          <button onClick={handleUpdateImage} className="px-4 py-2 bg-blue-500 text-white rounded">
            Update Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileImagesManager;
