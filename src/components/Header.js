import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../redux/slices/authSlice';
import supabase from '../utils/supabase/client';

const Header = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle
  const [primaryProfileImage, setPrimaryProfileImage] = useState(null); // State for primary profile image
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown menu
  const dropdownRef = useRef(null); // Ref for dropdown menu
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchPrimaryProfileImage = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profile_images')
          .select('image_url')
          .eq('profile_id', user.id)
          .eq('is_primary_profile', true) // Fetch only the primary profile image
          .maybeSingle();

        if (error) {
          console.error('Error fetching primary profile image:', error.message);
        } else {
          setPrimaryProfileImage(data?.image_url || null); // Set the primary profile image or null
        }
      }
    };

    fetchPrimaryProfileImage();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await dispatch(signOut());
      router.push('/signin'); // Redirect to the sign-in page after sign out
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const avatarUrl =
    primaryProfileImage ||
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAsAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABQYBBAcDAv/EADcQAAIBAgMFBAkDBAMAAAAAAAABAgMEBRESGiExQVEikaHRExQyQlJhcYGxYnLBFTNT4UN0gv/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABcRAQEBAQAAAAAAAAAAAAAAAAABERL/2gAMAwEAAhEDEQA/AO4gAAAAAAAAGG9wGQa9S8o03lq1PpE154i/cpr7sYJAEX/UK3ww7n5j+oVvhh3PzLialAR8MRfv019mbFO8o1Hlq0v9W4mK2AYTzRkAAAAAAAAAAAAAAAM0by70ZwpPt830A9bm7hQzS7U+iI6tcVKzep9nouCPJvN5sGsQAAAABAABXrRuKlL2ZbvhfAkba6hWyT7M+hEhbnmnkME+DRs7vW1Tq+1yfU3jKgAAAAAAAAB8zmoRcpPJLeBr31x6KGmPty8CKPqrUdWpKcuLfgfJqIAAIAGJSUYuUmlFLNtvJIoyCFudqMLoT0RqyrNcXSjmu8W21GF156XWlRb/AMscl3gTQMRlGSUotOL3premZAAAgfTcyUsrj0sNMn248fmRZ9UqjpVIzS4PvCp0HzCSnFSjwaPoyoAAAAAGlidTTTjTXGTzf0N0icQnquJL4ckWDWABpAAERhtRi22kks22c+2hxypidV0aMpKzi+zHhr+b8izbY3crXCHCDalXmqea6cX4IoBSgAKia2exyphlVU68nKzm+0v8fzR0BNSSlFpp701zRyUv+x927rCFCe+VCXo8+q4r8kVOAAgAAKksMqaqbpvjHh9DdInD56blL4k0SxKoACAAABCXO+4qv9T/ACTT4EJcf36n73+SxK+AAVAAAVbb1P1azfu+kln9cl/sppftsbaVxg8pxTcqM1U3dOD/ACUEsKAAqBctgk/Vrx8nUil3PP8Agppf9jrZ2+DxnNZSrzc/twXgiUicABFAAB6W7yuKb/UibIOh/fp/vX5JtEqxkAEUAAAhryOm4qLq8+8mSNxOGVSM8tzWRYNIAGkAARGJRU4yjKKlGSyafBooGO7PXGHVJVLaM6tpvakt7gukvM6AFxfkUckzz5odPnwOn3GHYfVeq5tbZy6yihbYfh1GSdva20ZfogimKVgWz1fEasalxGVK04uTWTn8l5nQIxUIqMUoxSySXBIywQAAQAAFe1nHVdU10eZMojcMhnUlPLclkSRKoACAAAB4XlL0tCS5rej3AEB9gbV9QdOeuK7EvBmqaZACmbT7QyqznZWM9NKLyqVIvfN9E+hRJ4vtRa2cpUbaPrFdPLc8oxfzfP7FXvcfxO7bU7qVOD9yj2F4byMAR9SnOTzlKT+rbEZzj7M5L6PI+QUSdnj+J2eWi5nUgvcq9teO8tOEbUWt7JUblK2rPhm84S+j5fcoYA60jJTNmNoZUpwsr6eqnJqNOpJ74Pkm+n4LkmRWQDasaHpZ65LsR8WQb1pS9FRinxe9nuAZaAAAAAAAAfNSEakHGSzTIe4oSoT0tbuT6k0edWnGrHTNZpgUba/E5WVirejJqtcJrNcYx5v+O8oRa9uMGxGliE76UHVs9KjCcN+hJcJLlvzeZVDcYAAUAAAAAAvmyGKO9snbVnnWt8lnn7UeT/gof4LZsNguIVb6F6oOlZ6XGU57vSLolz35b+AIulvRlWnlHNLmyXp0404KMVkkKdONOGmCyR9mLWwAEAAAAAAAAAAAYcU000mnxTKtjOxGH3zlVs87OtJ5vQs4P/zy+xagByPEdkMZsW36t6xT+Og9XhxRB1YToy0VoSpz5RmtL8TvB51qFKtHKrShUT5TimXUxwkHaKmAYPU3zwmxb/68fIQwDB6bThhNkn19Xj5F6THGaVOdaeijCU5fDCOb8Ccw7ZHGb9p+rer03/yV3p8OLOsUqFKisqVKFNLlGKR6E1cVTBdiMOsXGreZ3deLz7Sygn+3n9y1KKikopJLglyMgigAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9k='; // Default avatar if no primary profile image

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#f3e5ab] text-[#b22222] py-4 px-6 flex justify-between items-center shadow-md relative ">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image src="/logo.webp" alt="Logo" width={40} height={40} className="mr-3" />
        <h1 className="text-2xl font-bold">Matrimony</h1>
      </Link>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden absolute right-6 top-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[#b22222] focus:outline-none"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
            ></path>
          </svg>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:flex flex-col md:flex-row items-center gap-6 absolute md:static top-16 left-0 w-full md:w-auto bg-[#f3e5ab] md:bg-transparent z-50 md:z-auto shadow-lg md:shadow-none transition-all duration-300`}
      >
        <ul className="flex flex-col md:flex-row gap-6 mt-4 md:mt-0 text-center">
          <li>
            <Link href="/" className="text-lg font-semibold hover:text-[#8b0000]">
              Home
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link href="/feed" className="text-lg font-semibold hover:text-[#8b0000]">
                  Feed
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-lg font-semibold hover:text-[#8b0000]">
                  Posts
                </Link>
              </li>
              <li className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className=" focus:outline-none"
                >
                  <Image
                    src={avatarUrl}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full border border-gray-300"
                  />
                </button>
                {dropdownOpen && (
                  <div
                    className={`absolute ${
                      isOpen ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : 'right-0 mt-2'
                    } w-64 max-w-[calc(100vw-16px)] bg-[#f3e5ab] border border-[#b22222] rounded shadow-lg z-50 text-center`}
                  >
                    <Link
                      href={`/profile/${user.id}`}
                      className="block px-4 py-2 text-sm text-[#b22222] hover:bg-[#fffacd] rounded"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/account-center"
                      className="block px-4 py-2 text-sm text-[#b22222] hover:bg-[#fffacd] rounded"
                    >
                      Account Center
                    </Link>
                    <Link
                      href="/my-posts"
                      className="block px-4 py-2 text-sm text-[#b22222] hover:bg-[#fffacd] rounded"
                    >
                      My Posts
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-center px-4 py-2 text-sm text-[#b22222] hover:bg-[#fffacd] rounded"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/signup">
                  <button className="bg-[#b22222] text-[#fffacd] px-4 py-2 rounded hover:bg-[#8b0000] transition-all duration-300">
                    Register
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/signin">
                  <button className="bg-[#b22222] text-[#fffacd] px-4 py-2 rounded hover:bg-[#8b0000] transition-all duration-300">
                    Sign In
                  </button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
