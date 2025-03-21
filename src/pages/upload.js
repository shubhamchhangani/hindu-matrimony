'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import supabase from '../utils/supabase/client';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Upload = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [housePhoto, setHousePhoto] = useState(null);
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

  const handleUpload = async () => {
    if (!profilePhoto) {
      alert('Please select a profile photo');
      return;
    }

    try {
      setUploading(true);
      const photoUrls = {};

      // Upload profile photo
      const profileFileExt = profilePhoto.name.split('.').pop();
      const profileFileName = `${uid}/profile_${Date.now()}.${profileFileExt}`;
      
      const { error: profileError } = await supabase.storage
        .from('userphotos')
        .upload(profileFileName, profilePhoto);

      if (profileError) throw profileError;
      
      const { data: { publicUrl: profileUrl } } = supabase.storage
        .from('userphotos')
        .getPublicUrl(profileFileName);
      
      photoUrls.profile_picture = profileUrl;

      // Upload house photo if selected
      if (housePhoto) {
        const houseFileExt = housePhoto.name.split('.').pop();
        const houseFileName = `${uid}/house_${Date.now()}.${houseFileExt}`;
        
        const { error: houseError } = await supabase.storage
          .from('userphotos')
          .upload(houseFileName, housePhoto);

        if (houseError) throw houseError;
        
        const { data: { publicUrl: houseUrl } } = supabase.storage
          .from('userphotos')
          .getPublicUrl(houseFileName);
        
        photoUrls.house_picture = houseUrl;
      }

      // Update profile with photo URLs
      const { error: updateError } = await supabase
        .from('profiles')
        .update(photoUrls)
        .eq('id', uid);

      if (updateError) throw updateError;

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
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
           style={{ backgroundImage: "url('/background.webp')" }}>
        <div className="p-8 bg-[#f3e5ab] shadow-2xl rounded-2xl w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#b22222]">Upload Photos</h2>
          
          <div className="mb-6">
            <label className="block text-[#b22222] font-semibold mb-2">Profile Photo (Required)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePhotoChange}
              className="w-full p-2 border-2 border-[#b22222] rounded"
            />
            {profilePhoto && (
              <p className="mt-2 text-sm text-[#b22222]">Selected: {profilePhoto.name}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-[#b22222] font-semibold mb-2">House Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleHousePhotoChange}
              className="w-full p-2 border-2 border-[#b22222] rounded"
            />
            {housePhoto && (
              <p className="mt-2 text-sm text-[#b22222]">Selected: {housePhoto.name}</p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || !profilePhoto}
            className={`w-full p-3 rounded-lg text-white font-semibold
              ${uploading || !profilePhoto
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#b22222] hover:bg-[#8b0000] transition-colors'}`}
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