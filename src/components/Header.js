import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      //router.push('/signin');
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
          <li>
            <Link href="/about" className="text-lg font-semibold hover:text-[#8b0000]">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-lg font-semibold hover:text-[#8b0000]">
              Contact
            </Link>
          </li>
          
          {!user ? (
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
          ) : (
            <li>
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
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
