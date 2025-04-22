"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  const { id } = router.query;
  const [profile, setProfile] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loadingPrimary, setLoadingPrimary] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [sliderImages, setSliderImages] = useState([]);

  // Editable fields state
  const [maritalStatus, setMaritalStatus] = useState('');
  const [weight, setWeight] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [country, setCountry] = useState('');
  const [occupation, setOccupation] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');

  // Load authenticated user session
  useEffect(() => {
    if (!router.isReady) return;
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        setAuthUser(session.user);
      }
    };
    loadUser();
  }, [router]);

  // Chat handler
  const startChat = async () => {
    const { data, error } = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user1: authUser.id, user2: profile.id }),
    }).then((res) => res.json());
    if (!error) {
      router.push(`/chat/${data.id}`);
    }
  };

  // Fetch profile and images
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
      if (error) console.error("Error fetching profile:", error);
      else if (data) {
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

    // Fetch primary images for the slider
    const fetchPrimaryImages = async () => {
      try {
        const { data, error } = await supabase
          .from('profile_images')
          .select('*')
          .eq('profile_id', id)
          .or('is_primary_profile.eq.true,is_primary_house.eq.true'); 
        if (error) throw error;
        const primaryProfileImage = data.find((img) => img.is_primary_profile);
        const primaryHouseImage = data.find((img) => img.is_primary_house);
        const sliderImgs = [];
        if (primaryProfileImage) sliderImgs.push(primaryProfileImage.image_url);
        if (primaryHouseImage) sliderImgs.push(primaryHouseImage.image_url);
        setSliderImages(sliderImgs);
      } catch (error) {
        console.error("Error fetching primary images:", error);
      }
    };

    fetchProfile();
    fetchPrimaryImages();
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

  // Handler to set an image as primary for profile or house
  const handleSetPrimary = async (imageId, type) => {
    setLoadingPrimary(true);
    const selectedImage = allImages.find((img) => img.id === imageId);
    if (!selectedImage) {
      setLoadingPrimary(false);
      return;
    }
    try {
      const updateData = {};
      if (type === 'profile') updateData.profile_picture = selectedImage.image_url;
      else if (type === 'house') updateData.house_picture = selectedImage.image_url;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;

      // Refresh the profile data
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

  // Handler for updating profile text fields
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-center text-[#8B0000] mb-8">
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
              className="mb-10"
            >
              {sliderImages.map((imgUrl, idx) => (
                <SwiperSlide key={idx}>
                  <div className="relative h-64 w-full sm:h-80 md:h-96">
                    <Image
                      src={imgUrl}
                      alt={`Image ${idx + 1}`}
                      fill
                      className="object-cover rounded-xl shadow-md transition-transform hover:scale-105"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="flex items-center justify-center h-64 sm:h-80 md:h-96 bg-gray-200 rounded-xl mb-10">
              <p className="text-xl text-gray-600">No primary images available</p>
            </div>
          )}

          {/* "All Photos" Button */}
          {authUser && authUser.id === id && (
            <div className="mb-10 text-center">
              <button
                onClick={() => setShowModal(true)}
                className="px-8 py-3 bg-[#8B0000] text-white rounded-full hover:bg-[#640000] transition-colors shadow-lg"
              >
                View All Photos
              </button>
            </div>
          )}

          {/* Gallery Modal */}
          {showModal && (
            <AllPhotosModal
              profileId={id}
              images={allImages}
              onClose={() => setShowModal(false)}
              onSetPrimary={handleSetPrimary}
              loadingPrimary={loadingPrimary}
              isOwner={authUser && authUser.id === id}
              onRefresh={refreshImages}
            />
          )}

          {/* Profile Details */}
          <div className="mb-10 space-y-4 text-base text-gray-700">
            <p><span className="font-bold">Full Name:</span> {profile.full_name}</p>
            <p><span className="font-bold">Date of Birth:</span> {new Date(profile.date_of_birth).toLocaleDateString()}</p>
            <p><span className="font-bold">Gender:</span> {profile.gender}</p>
            <p><span className="font-bold">Caste:</span> {profile.caste || "Not specified"}</p>
            <p><span className="font-bold">Mother Tongue:</span> {profile.mother_tongue}</p>
            <p><span className="font-bold">Marital Status:</span> {profile.marital_status || "Not specified"}</p>
            <p><span className="font-bold">Height:</span> {profile.height_cm ? `${profile.height_cm} cm` : "Not specified"}</p>
            <p><span className="font-bold">Weight:</span> {profile.weight_kg ? `${profile.weight_kg} kg` : "Not specified"}</p>
            <p><span className="font-bold">Diet:</span> {profile.diet || "Not specified"}</p>
            <p><span className="font-bold">Smoking Habit:</span> {profile.smoking_habit ? "Yes" : "No"}</p>
            <p><span className="font-bold">Drinking Habit:</span> {profile.drinking_habit ? "Yes" : "No"}</p>
            <p><span className="font-bold">Occupation:</span> {profile.occupation}</p>
            <p><span className="font-bold">Annual Income:</span> ₹{profile.annual_income}</p>
            <p><span className="font-bold">City:</span> {profile.city || "Not specified"}</p>
            <p><span className="font-bold">State:</span> {profile.state || "Not specified"}</p>
            <p><span className="font-bold">Country:</span> {profile.country || "Not specified"}</p>
            <p><span className="font-bold">Bio:</span> {profile.bio || "Not specified"}</p>
            <div className="mt-4">
              <button 
                onClick={startChat} 
                disabled={!profile.allowChat}
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md"
              >
                {profile.allowChat ? "Start Chat" : "Chat Disabled"}
              </button>
            </div>
          </div>
          
          {/* Update Profile Form (only for owner) */}
          {authUser && authUser.id === id && (
            <>
              <div className="mb-6 text-center">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-8 py-3 bg-[#8B0000] text-white rounded-full hover:bg-[#640000] transition-colors shadow-lg"
                >
                  {editMode ? 'Cancel Update' : 'Update Profile'}
                </button>
              </div>
              {editMode && (
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-2">Marital Status</label>
                      <input
                        type="text"
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value)}
                        className="w-full p-3 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-2">Weight (kg)</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full p-3 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-3 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-2">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-3 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-2">State</label>
                      <input
                        type="text"
                        value={stateValue}
                        onChange={(e) => setStateValue(e.target.value)}
                        className="w-full p-3 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-2">Country</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full p-3 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-2">Occupation</label>
                      <input
                        type="text"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="w-full p-3 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-2">Annual Income</label>
                      <input
                        type="number"
                        value={annualIncome}
                        onChange={(e) => setAnnualIncome(e.target.value)}
                        className="w-full p-3 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors shadow-lg"
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
