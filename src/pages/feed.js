'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import supabase from '../utils/supabase/client';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Feed = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProfilesWithImages();
  }, []);

  // In your feed.js, after fetching profiles from the 'profiles' table,
// you can query for related images:
// Example snippet inside Feed.js (no style changes as per your request)
const fetchProfilesWithImages = async () => {
  try {
    // Fetch profiles and their associated primary profile images
    const { data: profilesData, error } = await supabase
      .from('profiles')
      .select(`
        *,
        profile_images (
          image_url, is_primary_profile
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Process each profile to pick the primary profile image (if exists)
    const profilesWithImages = profilesData.map(profile => {
      // Filter images to find the primary profile image
      const primaryImage = profile.profile_images?.find(img => img.is_primary_profile)?.image_url;

      // Fallback: If no primary image exists, use a default avatar based on gender
      const fallbackImage = profile.gender === 'Female'
        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS08t3lZlT_JscMUhdU5tbWMj9vnLBm9K3yKA&s"
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oghbsuzggpkknQSSU-Ch_xep_9v3m6EeBQ&s";

      return {
        ...profile,
        primary_image: primaryImage || fallbackImage, // Assign the primary image or fallback
      };
    });

    setProfiles(profilesWithImages);
  } catch (error) {
    console.error('Error fetching profiles:', error);
  } finally {
    setLoading(false);
  }
};


  const handleProfileClick = (userId) => {
    router.push(`/profile/${userId}`);
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#fff5e6] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[#b22222] text-center mb-8">
            Find Your Perfect Match
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleProfileClick(profile.id)}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={profile.primary_image} // Use primary_image
                    alt={profile.full_name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Use placeholder image on error
                      e.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS08t3lZlT_JscMUhdU5tbWMj9vnLBm9K3yKA&s";
                      // Prevent infinite loop by removing the error handler
                      e.target.onerror = null;
                    }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-[#b22222] mb-2">
                    {profile.full_name}
                  </h2>
                  <div className="text-gray-600">
                    <p>{profile.occupation}</p>
                    <p>{profile.city}, {profile.state}</p>
                    <p>{new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()} years</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Feed;