import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../redux/slices/authSlice';
import supabase from '../utils/supabase/client';

const Header = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error.message);
        } else {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await dispatch(signOut());
    router.push('/signin'); // Redirect to the sign-in page after sign out
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <header className="bg-[#f3e5ab] text-[#b22222] py-4 px-6 flex justify-between items-center shadow-md relative">
      <div className={`flex items-center ${isOpen ? 'hidden' : 'flex'}`}>
        <Image src="/logo.webp" alt="Logo" width={40} height={40} className="mr-3" />
        <h1 className="text-2xl font-bold">Matrimony</h1>
      </div>

      <div className="md:hidden absolute right-6 top-4">
        <button onClick={() => setIsOpen(!isOpen)} className="text-[#b22222] focus:outline-none">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
          </svg>
        </button>
      </div>

      <nav className={`md:flex ${isOpen ? 'block' : 'hidden'} w-full md:w-auto transition-all duration-300 ease-in-out`}>
        <ul className="flex flex-col md:flex-row gap-6 mt-4 md:mt-0">
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
              <li className="flex items-center gap-2">
                <Link href={`/profile/${user.id}`} className="text-lg font-semibold hover:text-[#8b0000]">
                  {profile?.full_name}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-[#b22222] text-[#fffacd] px-4 py-2 rounded hover:bg-[#8b0000] transition-all duration-300 flex items-center gap-2"
                >
                  <span>Sign Out</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                </button>
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
