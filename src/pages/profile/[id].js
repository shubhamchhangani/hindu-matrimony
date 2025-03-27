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
        .or('is_primary_profile.eq.true,is_primary_house.eq.true'); // Fetch both primary profile and house images
      if (error) throw error;

      const primaryProfileImage = data.find((img) => img.is_primary_profile);
      const primaryHouseImage = data.find((img) => img.is_primary_house);

      const sliderImages = [];
      if (primaryProfileImage) sliderImages.push(primaryProfileImage.image_url);
      if (primaryHouseImage) sliderImages.push(primaryHouseImage.image_url);

      setSliderImages(sliderImages);
    } catch (error) {
      console.error("Error fetching primary images:", error);
    }
  };


    fetchProfile();
    fetchPrimaryImages();
  }, [id, router]);

  
  // Call this function in the `useEffect` hook
  

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

      // Refresh the profile data to reflect the changes
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
                  <div className="relative h-64 w-full sm:h-80 md:h-96">
                    <Image
                      src={imgUrl}
                      alt={`Image ${idx + 1}`}
                      fill
                      className="object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="flex items-center justify-center h-64 sm:h-80 md:h-96 bg-gray-200 rounded-lg mb-8">
              <p className="text-lg sm:text-xl text-gray-600">No primary images available</p>
            </div>
          )}

          {/* "All Photos" Button */}
          {authUser && authUser.id === id && (
            <div className="mb-8 text-center">
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-[#8B0000] text-white rounded-full hover:bg-[#640000] transition-colors shadow-lg"
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
          <div className="mb-8 space-y-4 text-base sm:text-lg text-gray-800">
            <p>
              <strong>Full Name:</strong> {profile.full_name}
            </p>
            <p>
              <strong>Date of Birth:</strong> {new Date(profile.date_of_birth).toLocaleDateString()}
            </p>
            <p>
              <strong>Gender:</strong> {profile.gender}
            </p>
            <p>
              <strong>Caste:</strong> {profile.caste || "Not specified"}
            </p>
            <p>
              <strong>Mother Tongue:</strong> {profile.mother_tongue}
            </p>
            <p>
              <strong>Marital Status:</strong> {profile.marital_status || "Not specified"}
            </p>
            <p>
              <strong>Height:</strong> {profile.height_cm ? `${profile.height_cm} cm` : "Not specified"}
            </p>
            <p>
              <strong>Weight:</strong> {profile.weight_kg ? `${profile.weight_kg} kg` : "Not specified"}
            </p>
            <p>
              <strong>Diet:</strong> {profile.diet || "Not specified"}
            </p>
            <p>
              <strong>Smoking Habit:</strong> {profile.smoking_habit ? "Yes" : "No"}
            </p>
            <p>
              <strong>Drinking Habit:</strong> {profile.drinking_habit ? "Yes" : "No"}
            </p>
            <p>
              <strong>Occupation:</strong> {profile.occupation}
            </p>
            <p>
              <strong>Annual Income:</strong> ₹{profile.annual_income}
            </p>
            <p>
              <strong>City:</strong> {profile.city || "Not specified"}
            </p>
            <p>
              <strong>State:</strong> {profile.state || "Not specified"}
            </p>
            <p>
              <strong>Country:</strong> {profile.country || "Not specified"}
            </p>
            <p>
              <strong>Bio:</strong> {profile.bio || "Not specified"}
            </p>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
