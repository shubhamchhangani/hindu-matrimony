"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // For pages directory
import Image from 'next/image';
import supabase from '../../utils/supabase/client';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import AllPhotosModal from '../../components/AllPhotosModal';

const ProfileDetails = () => {
  const router = useRouter();
  const { id } = router.query; // Dynamic route parameter (e.g. /profile/USER_ID)
  const [profile, setProfile] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loadingPrimary, setLoadingPrimary] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  // Editable fields state
  const [maritalStatus, setMaritalStatus] = useState('');
  const [weight, setWeight] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [country, setCountry] = useState('');
  const [occupation, setOccupation] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');

  // File states for updating primary images (optional if you want separate update forms)
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [housePhotoFile, setHousePhotoFile] = useState(null);

  // Load authenticated user session
  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        setAuthUser(session.user);
      }
    };
    loadUser();
  }, []);

  // Fetch profile and images when router is ready
  useEffect(() => {
    if (!router.isReady) return;
    if (!id) {
      router.push('/signup');
      return;
    }
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        setProfile(data);
        setMaritalStatus(data.marital_status || '');
        setWeight(data.weight_kg || '');
        setBio(data.bio || '');
        setCity(data.city || '');
        setStateValue(data.state || '');
        setCountry(data.country || '');
        setOccupation(data.occupation || '');
        setAnnualIncome(data.annual_income || '');
      }
      setLoading(false);
    };

    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('profile_images')
        .select('*')
        .eq('profile_id', id);
      if (error) console.error("Error fetching images:", error);
      else if (data) setAllImages(data);
    };

    fetchProfile();
    fetchImages();
  }, [id, router]);

  // Refresh images callback
  const refreshImages = async () => {
    const { data, error } = await supabase
      .from('profile_images')
      .select('*')
      .eq('profile_id', id);
    if (error) console.error("Error refreshing images:", error);
    else if (data) setAllImages(data);
  };

  // Handler to set an image as primary (update primary image in your app)
  // In this implementation, you may simply choose one image from the gallery to be primary.
  // For example, update a field in the profiles table if needed, or simply reorder images.
  const handleSetPrimary = async (imageId, type) => {
    setLoadingPrimary(true);
    const selectedImage = allImages.find((img) => img.id === imageId);
    if (!selectedImage) {
      setLoadingPrimary(false);
      return;
    }
    try {
      // In the new design, the primary images are those used in the slider.
      // One approach is to update the profiles table with the chosen primary URLs.
      const updateData = {};
      if (type === 'profile') updateData.profile_picture = selectedImage.image_url;
      else if (type === 'house') updateData.house_picture = selectedImage.image_url;
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
      // Refresh profile data
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      setProfile(data);
      alert(`Primary ${type} image updated successfully!`);
    } catch (error) {
      console.error("Error setting primary image:", error);
      alert("Error setting primary image: " + error.message);
    }
    setLoadingPrimary(false);
    setShowModal(false);
  };

  // Handler for updating profile text fields (without images, as images are now managed separately)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          marital_status: maritalStatus,
          weight_kg: weight,
          bio,
          city,
          state: stateValue,
          country,
          occupation,
          annual_income: annualIncome,
        })
        .eq('id', id);
      if (updateError) throw updateError;
      alert("Profile updated successfully!");
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      setProfile(data);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile: " + error.message);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-2xl text-[#8B0000]">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  // Prepare slider images: use primary profile & house images from profiles table (if updated via setPrimary)
  const sliderImages = [];
  if (profile && profile.profile_picture) sliderImages.push(profile.profile_picture);
  if (profile && profile.house_picture) sliderImages.push(profile.house_picture);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-4xl font-extrabold text-center text-[#8B0000] mb-8">
            {profile.full_name}&apos;s Profile
          </h1>
          {/* Primary Images Slider */}
          {sliderImages.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              className="mb-8"
            >
              {sliderImages.map((imgUrl, idx) => (
                <SwiperSlide key={idx}>
                  <div className="relative h-80 w-full">
                    <Image src={imgUrl} alt={`Image ${idx + 1}`} fill className="object-cover rounded-lg" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="flex items-center justify-center h-80 bg-gray-200 rounded-lg mb-8">
              <p className="text-xl text-gray-600">No primary images available</p>
            </div>
          )}

          {/* "All Photos" Button (only for owner) */}
          {authUser && authUser.id === id && (
            <div className="mb-8 text-center">
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                View All Photos
              </button>
            </div>
          )}

          {/* Gallery Modal */}
          {showModal && (
            <AllPhotosModal
              images={allImages}
              onClose={() => setShowModal(false)}
              onSetPrimary={handleSetPrimary}
              loadingPrimary={loadingPrimary}
              isOwner={authUser && authUser.id === id}
              onRefresh={refreshImages}
            />
          )}

          {/* Profile Details */}
          <div className="mb-8 space-y-4 text-lg text-gray-800">
            <p><strong>Marital Status:</strong> {profile.marital_status}</p>
            <p><strong>Weight:</strong> {profile.weight_kg} kg</p>
            <p><strong>Bio:</strong> {profile.bio}</p>
            <p><strong>City:</strong> {profile.city}</p>
            <p><strong>State:</strong> {profile.state}</p>
            <p><strong>Country:</strong> {profile.country}</p>
            <p><strong>Occupation:</strong> {profile.occupation}</p>
            <p><strong>Annual Income:</strong> ₹{profile.annual_income}</p>
          </div>

          {/* Update Profile Form (only for owner) */}
          {authUser && authUser.id === id && (
            <>
              <button
                onClick={() => setEditMode(!editMode)}
                className="mb-6 px-6 py-3 bg-[#8B0000] text-white rounded-full hover:bg-[#640000] transition-colors"
              >
                {editMode ? 'Cancel Update' : 'Update Profile'}
              </button>
              {editMode && (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold">Marital Status</label>
                      <input
                        type="text"
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold">Weight (kg)</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold">State</label>
                      <input
                        type="text"
                        value={stateValue}
                        onChange={(e) => setStateValue(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold">Country</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold">Occupation</label>
                      <input
                        type="text"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold">Annual Income</label>
                      <input
                        type="number"
                        value={annualIncome}
                        onChange={(e) => setAnnualIncome(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full p-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfileDetails;
