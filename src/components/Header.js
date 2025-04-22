import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../redux/slices/authSlice';
import supabase from '../utils/supabase/client';

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [primaryProfileImage, setPrimaryProfileImage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchPrimaryProfileImage = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profile_images')
          .select('image_url')
          .eq('profile_id', user.id)
          .eq('is_primary_profile', true)
          .maybeSingle();
        if (error) {
          console.error('Error fetching primary profile image:', error.message);
        } else {
          setPrimaryProfileImage(data?.image_url || null);
        }
      }
    };
    fetchPrimaryProfileImage();
  }, [user]);

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

  const handleSignOut = async () => {
    try {
      await dispatch(signOut());
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const avatarUrl =
    primaryProfileImage ||
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...';

  return (
    <header className="bg-[#f3e5ab] text-[#b22222] py-1 px-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.webp" alt="Logo" width={40} height={40} className="mr-2" />
          <h1 className="text-xl font-bold">Matrimony</h1>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-5">
          <Link href="/" className="text-base font-medium hover:text-[#8b0000]">
            Home
          </Link>
          {user && (
            <>
              <Link href="/feed" className="text-base font-medium hover:text-[#8b0000]">
                Feed
              </Link>
              {user.role && user.role.toLowerCase() === 'admin' && (
                <Link href="/admin" className="text-base font-medium hover:text-[#8b0000]">
                  Admin
                </Link>
              )}
              <Link href="/posts" className="text-base font-medium hover:text-[#8b0000]">
                Posts
              </Link>
            </>
          )}
          {!user && (
            <>
              <Link href="/signup" className="text-base font-medium hover:text-[#8b0000]">
                Register
              </Link>
              <Link href="/signin" className="text-base font-medium hover:text-[#8b0000]">
                Sign In
              </Link>
            </>
          )}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
                <Image
                  src={avatarUrl}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border border-gray-300"
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#f3e5ab] border border-[#b22222] rounded shadow-lg z-50">
                  <Link href={`/profile/${user.id}`} className="block px-3 py-1 hover:bg-[#fffacd] text-sm text-[#b22222]">
                    My Profile
                  </Link>
                  <Link href="/account-center" className="block px-3 py-1 hover:bg-[#fffacd] text-sm text-[#b22222]">
                    Account Center
                  </Link>
                  <Link href="/my-posts" className="block px-3 py-1 hover:bg-[#fffacd] text-sm text-[#b22222]">
                    My Posts
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-1 hover:bg-[#fffacd] text-sm text-[#b22222] rounded"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-[#b22222] focus:outline-none">
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
      </div>
      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden mt-2 bg-[#f3e5ab] border-t border-[#b22222]">
          <ul className="flex flex-col items-center space-y-2 py-3">
            <li>
              <Link href="/" className="text-base font-medium hover:text-[#8b0000]">
                Home
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link href="/feed" className="text-base font-medium hover:text-[#8b0000]">
                    Feed
                  </Link>
                </li>
                {user.role && user.role.toLowerCase() === 'admin' && (
                  <li>
                    <Link href="/admin" className="text-base font-medium hover:text-[#8b0000]">
                      Admin
                    </Link>
                  </li>
                )}
                <li>
                  <Link href="/posts" className="text-base font-medium hover:text-[#8b0000]">
                    Posts
                  </Link>
                </li>
                <li>
                  <Link href="/my-posts" className="text-base font-medium hover:text-[#8b0000]">
                    My Posts
                  </Link>
                </li>
                <li>
                  <Link href={`/profile/${user.id}`} className="text-base font-medium hover:text-[#8b0000]">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link href="/account-center" className="text-base font-medium hover:text-[#8b0000]">
                    Account Center
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="text-base font-medium hover:text-[#8b0000]"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/signup" className="text-base font-medium hover:text-[#8b0000]">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/signin" className="text-base font-medium hover:text-[#8b0000]">
                    Sign In
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
