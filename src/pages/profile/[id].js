'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  // Changed from next/navigation
import Image from 'next/image';
import supabase from '../../utils/supabase/client';  // Updated path
import Header from '../../components/Header';  // Updated path
import Footer from '../../components/Footer';  // Updated path

const ProfileDetail = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilepic, setProfilePic] = useState(null);
  const [housepic, setHousePic] = useState(null);
  const router = useRouter();
  const { id } = router.query;  // Use router.query instead of useSearchParams

  

  useEffect(() => {
    if (id) {  // Only fetch when id is available after hydration
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();
    
          if (error) throw error;

          // Get the public URL for profile picture if it exists
          
          // Get the public URL for house picture if it exists
          async function fetchUserImages(id) {
            // Fetch user data from Supabase database
            const { data, error } = await supabase
              .from("profiles") // Change this to your actual table name
              .select("profile_picture, house_picture")
              .eq("id", id)
              .single();
      
            
          
            if (error) {
              console.error("Error fetching user images:", error);
              return null;
            }
      
            
      
            const profilePic = data?.profile_picture;
            const housePic = data?.house_picture;
            //const housePic = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/house_pictures/${data.house_picture}`;
            setProfilePic(profilePic);
            setHousePic(housePic);
        }

        fetchUserImages(id);
          

          setProfile(data);
        } catch (error) {
          console.error('Error fetching profile:', error);
          alert('Error loading profile');
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [id]);

  
  const handleBack = () => {
    router.push('/feed');
  };

  if (loading) {
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

  if (!profile) {
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
              {profile.house_photo && (
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
                  <p>₹{profile.annual_income.toLocaleString()}</p>
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
};

export default ProfileDetail;