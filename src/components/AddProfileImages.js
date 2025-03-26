"use client";
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProfileImage } from '../redux/slices/profileImagesSlice';
import { useRouter } from 'next/router';

const AddProfileImages = () => {
  const router = useRouter();
  // Use 'id' because your dynamic route is [id].js
  const { id } = router.query; 
  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageType, setImageType] = useState('profile'); // 'profile' or 'house'
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image file.");
      return;
    }
    if (!id) {
      alert("User ID not found.");
      return;
    }
    setUploading(true);
    try {
      await dispatch(addProfileImage({ profileId: id, file: selectedFile, imageType }));
      setSelectedFile(null);
      alert("Image added successfully!");
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Error uploading image: " + err);
    }
    setUploading(false);
  };

  return (
    <div className="p-4 border rounded shadow my-4">
      <h2 className="text-lg font-bold mb-2">Add New Image</h2>
      <div className="mb-2">
        <label className="block mb-1 font-semibold">Select Image Type:</label>
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
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="border p-2 rounded w-full" 
        />
      </div>
      <button 
        onClick={handleUpload}
        disabled={uploading}
        className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {uploading ? 'Uploading...' : 'Add Image'}
      </button>
    </div>
  );
};

export default AddProfileImages;
