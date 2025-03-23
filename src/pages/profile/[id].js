'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../../redux/slices/profilesSlice';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ProfileDetail() {
  const router = useRouter();
  const { id } = router.query; // Grab profile ID from query parameters
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.profiles);

  useEffect(() => {
    if (id) {
      dispatch(fetchProfile(id));
    }
  }, [id, dispatch]);

  const handleBack = () => {
    router.push('/feed');
  };

  if (status === 'loading') {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-2xl text-[#b22222]">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (status === 'failed' || !profile) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-2xl text-[#b22222]">Profile not found</div>
        </div>
        <Footer />
      </>
    );
  }

  // Assume the profile record includes profile_picture and house_picture fields
  const profilepic = profile.profile_picture;
  const housepic = profile.house_picture;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#fff5e6] py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
          <button
            onClick={handleBack}
            className="mb-6 flex items-center text-[#b22222] hover:text-[#8b0000] transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to Feed
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="relative h-96 w-full rounded-lg overflow-hidden">
                <Image
                  src={profilepic || '/default-profile.jpeg'}
                  alt={profile.full_name}
                  fill
                  className="object-cover"
                />
              </div>
              {housepic && (
                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                  <Image
                    src={housepic}
                    alt="House Photo"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-[#b22222]">{profile.full_name}</h1>
              
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p className="font-semibold">Age</p>
                  <p>{new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()} years</p>
                </div>
                <div>
                  <p className="font-semibold">Gender</p>
                  <p>{profile.gender}</p>
                </div>
                <div>
                  <p className="font-semibold">Occupation</p>
                  <p>{profile.occupation}</p>
                </div>
                <div>
                  <p className="font-semibold">Annual Income</p>
                  <p>₹{profile.annual_income?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Location</p>
                  <p>{profile.city}, {profile.state}</p>
                </div>
                <div>
                  <p className="font-semibold">Mother Tongue</p>
                  <p>{profile.mother_tongue}</p>
                </div>
                <div>
                  <p className="font-semibold">Marital Status</p>
                  <p>{profile.marital_status}</p>
                </div>
                <div>
                  <p className="font-semibold">Diet</p>
                  <p>{profile.diet}</p>
                </div>
                <div>
                  <p className="font-semibold">Height</p>
                  <p>{profile.height_cm} cm</p>
                </div>
                <div>
                  <p className="font-semibold">Weight</p>
                  <p>{profile.weight_kg} kg</p>
                </div>
              </div>

              {profile.bio && (
                <div>
                  <p className="font-semibold text-gray-700">About</p>
                  <p className="text-gray-600 mt-2">{profile.bio}</p>
                </div>
              )}

              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-[#b22222] mb-4">Lifestyle</h2>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <p className="font-semibold">Smoking</p>
                    <p>{profile.smoking_habit ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Drinking</p>
                    <p>{profile.drinking_habit ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
