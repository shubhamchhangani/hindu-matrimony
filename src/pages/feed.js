'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import supabase from '../utils/supabase/client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import debounce from 'lodash.debounce';
import gotras from '../data/gotra.json';

const Feed = () => {
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedGotra, setSelectedGotra] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [ageRange, setAgeRange] = useState([18, 35]);
  const router = useRouter();

  useEffect(() => {
    fetchProfilesWithImages();
  }, [searchTerm, selectedGotra, selectedGender, ageRange]);

  const fetchProfilesWithImages = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select(`*, profile_images (image_url, is_primary_profile)`)
        .order('created_at', { ascending: sortOrder === 'asc' });

      if (searchTerm) query = query.ilike('full_name', `%${searchTerm}%`);
      if (selectedGotra) query = query.eq('gotra', selectedGotra);
      if (selectedGender) query = query.eq('gender', selectedGender);
      if (ageRange.length === 2) {
        query = query.gte('age', ageRange[0]).lte('age', ageRange[1]);
      }

      const { data: profilesData, error } = await query;
      if (error) throw error;

      const profilesWithImages = profilesData.map(profile => {
        const primaryImage = profile.profile_images?.find(img => img.is_primary_profile)?.image_url;
        const fallbackImage = profile.gender === 'Female'
          ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS08t3lZlT_JscMUhdU5tbWMj9vnLBm9K3yKA&s'
          : 'https://encrypted-tbn0.gstatic.com/images?q=tb:n:ANd9GcS8oghbsuzggpkknQSSU-Ch_xep_9v3m6EeBQ&s';

        return {
          ...profile,
          primary_image: primaryImage || fallbackImage,
        };
      });

      setProfiles(profilesWithImages);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = debounce(async (term) => {
    if (!term) return setSuggestions([]);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, city, gotra')
      .ilike('full_name', `%${term}%`)
      .limit(5);
    if (!error && data) setSuggestions(data);
  }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (id) => {
    setSuggestions([]);
    router.push(`/profile/${id}`);
  };

  const handleProfileClick = (userId) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#fff5e6] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[#b22222] text-center mb-8">
            Find Your Perfect Match
          </h1>

          {/* Reset Button and Count */}
          <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
            <p className="text-gray-700 font-medium">{profiles.length} प्रोफाइल पाए गए</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGotra('');
                setSelectedGender('');
                setAgeRange([18, 35]);
              }}
              className="bg-[#b22222] text-white px-4 py-2 rounded hover:bg-[#9d1e1e] transition"
            >
              फ़िल्टर रीसेट करें
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 border rounded text-sm"
            >
              <option value="desc">नवीनतम पहले</option>
              <option value="asc">पुराने पहले</option>
            </select>

            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 border rounded text-sm bg-white hover:bg-gray-100"
            >
              {viewMode === 'grid' ? 'list view' : 'grid view'}
            </button>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 justify-center">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="नाम खोजें..."
              className="w-full sm:w-1/4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#b22222]"
            />
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full sm:w-1/4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#b22222]"
            >
              <option value="">सभी लिंग</option>
              <option value="Male">पुरुष</option>
              <option value="Female">महिला</option>
            </select>
            <div className="w-full sm:w-1/2 md:w-1/3 mx-auto flex flex-col items-center">
              <label className="block text-gray-700 mb-1 text-center">आयु सीमा</label>
              <input
                type="range"
                min="18"
                max="60"
                value={ageRange[0]}
                onChange={(e) => setAgeRange([Number(e.target.value), ageRange[1]])}
                className="w-full h-2 bg-gray-300 rounded-lg accent-[#b22222]"
              />
              <input
                type="range"
                min="18"
                max="60"
                value={ageRange[1]}
                onChange={(e) => setAgeRange([ageRange[0], Number(e.target.value)])}
                className="w-full h-2 bg-gray-300 rounded-lg accent-[#b22222] mt-2"
              />
              <p className="text-gray-600 mt-2">{ageRange[0]} - {ageRange[1]} वर्ष</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-2xl text-[#b22222]">Loading...</div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => handleProfileClick(profile.id)}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer ${viewMode === 'grid' ? 'transform transition-transform hover:scale-105' : 'flex gap-4 items-center'}`}
                >
                  <div className={`relative ${viewMode === 'grid' ? 'h-64 w-full' : 'h-32 w-32'} flex-shrink-0`}>
                    <Image
                      src={profile.primary_image}
                      alt={profile.full_name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = profile.gender === 'Female'
                          ? 'https://encrypted-tbn0.gstatic.com/images?q=tb:n:ANd9GcS08t3lZlT_JscMUhdU5tbWMj9vnLBm9K3yKA&s'
                          : 'https://encrypted-tbn0.gstatic.com/images?q=tb:n:ANd9GcS8oghbsuzggpkknQSSU-Ch_xep_9v3m6EeBQ&s';
                        e.target.onerror = null;
                      }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <h2 className="text-xl font-semibold text-[#b22222] mb-2">
                      {profile.full_name}
                    </h2>
                    <div className="text-gray-600">
                      <p>{profile.occupation}</p>
                      <p>{profile.city}, {profile.state}</p>
                      <p>{profile.age} years</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Feed;