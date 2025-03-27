"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import supabase from '../utils/supabase/client';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Upload = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [housePhoto, setHousePhoto] = useState(null);
  const [profilePhotoType, setProfilePhotoType] = useState('profile'); // default for first input
  const [housePhotoType, setHousePhotoType] = useState('house'); // default for second input
  const [uploading, setUploading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid');

  useEffect(() => {
    if (!uid) {
      router.push('/signup');
    }
  }, [uid, router]);

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setProfilePhoto(file);
    }
  };

  const handleHousePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setHousePhoto(file);
    }
  };

  // A helper function to upload a file and insert a record into profile_images table
  const uploadImage = async (file, imageType) => {
    const fileExt = file.name.split('.').pop();
    // Construct a unique filename so multiple uploads are possible.
    const fileName = `${uid}/${imageType}_${Date.now()}.${fileExt}`;

    // Upload file with upsert option so that if the file exists it is replaced
    const { error: uploadError } = await supabase.storage
      .from('userphotos')
      .upload(fileName, file, { upsert: true });
    if (uploadError) throw uploadError;

    // Retrieve public URL
    const { data: urlData } = supabase.storage
      .from('userphotos')
      .getPublicUrl(fileName);
    const imageUrl = urlData.publicUrl;

    // Insert a new record into profile_images table
    const { error: dbError } = await supabase
      .from('profile_images')
      .insert([{ profile_id: uid, image_type: imageType, image_url: imageUrl}]);
    if (dbError) throw dbError;

    return imageUrl;
  };

  const handleUpload = async () => {
    if (!profilePhoto) {
      alert('Please select a profile photo');
      return;
    }

    try {
      setUploading(true);

      // Upload the first image (with its selected type)
      await uploadImage(profilePhoto, profilePhotoType);

      // If a house photo is selected, upload it too with its type
      if (housePhoto) {
        await uploadImage(housePhoto, housePhotoType);
      }

      alert('Photos uploaded successfully!');
      router.push('/feed'); // Redirect to feed page
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Error uploading photos: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/background.webp')" }}
      >
        <div className="p-8 bg-[#f3e5ab] shadow-2xl rounded-2xl w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#b22222]">
            Upload Photos
          </h2>

          {/* Profile Photo Section */}
          <div className="mb-6">
            <label className="block text-[#b22222] font-semibold mb-2">
              Profile Photo (Required)
            </label>
            <select
              value={profilePhotoType}
              onChange={(e) => setProfilePhotoType(e.target.value)}
              className="w-full p-2 border-2 border-[#b22222] rounded mb-2"
            >
              <option value="profile">Profile Image</option>
              <option value="house">House Image</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePhotoChange}
              className="w-full p-2 border-2 border-[#b22222] rounded"
            />
            {profilePhoto && (
              <p className="mt-2 text-sm text-[#b22222]">
                Selected: {profilePhoto.name}
              </p>
            )}
          </div>

          {/* House Photo Section */}
          <div className="mb-6">
            <label className="block text-[#b22222] font-semibold mb-2">
              House Photo (Optional)
            </label>
            <select
              value={housePhotoType}
              onChange={(e) => setHousePhotoType(e.target.value)}
              className="w-full p-2 border-2 border-[#b22222] rounded mb-2"
            >
              <option value="house">House Image</option>
              <option value="profile">Profile Image</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={handleHousePhotoChange}
              className="w-full p-2 border-2 border-[#b22222] rounded"
            />
            {housePhoto && (
              <p className="mt-2 text-sm text-[#b22222]">
                Selected: {housePhoto.name}
              </p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || !profilePhoto}
            className={`w-full p-3 rounded-lg text-white font-semibold ${
              uploading || !profilePhoto
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#b22222] hover:bg-[#8b0000] transition-colors'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload Photos'}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Upload;
