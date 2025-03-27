'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../redux/slices/authSlice';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Signup = () => {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(null);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors(null);

    try {
      const resultAction = await dispatch(signUp({ email, password }));
      if (signUp.fulfilled.match(resultAction)) {
        const userId = resultAction.payload.id;
        router.push(`/register?uid=${userId}`);
      };

      if (signUpError) {
        setErrors(signUpError.message);
        return;
      }

      
    } catch (error) {
      setErrors('An error occurred during sign up');
    }
  };

  return (        
    <>
      <Header />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center mx-5"
        style={{ backgroundImage: "url('/background.webp')" }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl relative overflow-hidden">
        <div className="hidden md:block w-1/2 relative h-[600px]">
  <Image 
    src="/radha.webp" 
    alt="Signup" 
    fill
    className="object-cover rounded-l-2xl"
    sizes="(max-width: 768px) 100vw, 50vw"
    priority
  />
</div>
<div className="block md:hidden w-full mb-6">
  <div className="relative h-[200px] w-full">
    <Image 
      src="/radha.webp" 
      alt="Signup" 
      fill
      className="object-cover rounded-t-2xl"
      sizes="100vw"
      priority
    />
  </div>
</div>
          <div className="w-full md:w-1/2 p-4">
            <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              {error && <p className="error-text">{error}</p>}
              <button type="submit" className="submit-btn">Sign Up</button>
            {/* Link to Sign In */}
            <p className="text-center mt-4 text-sm text-[#b22222]">
              Already registered?{' '}
              <Link href="/signin" className="font-semibold text-[#8b0000] hover:underline">
                Sign In
              </Link>
            </p>
            </form>
            {errors && <p className="error-text">{errors}</p>}
          </div>
        </div>
        <style jsx>{`
          .input-field {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 2px solid #b22222;
            border-radius: 8px;
            background-color: #f3e5ab;
            color: #b22222;
            transition: all 0.3s;
          }
          .input-field:focus {
            border-color: #8b0000;
            box-shadow: 0px 0px 8px rgba(178, 34, 34, 0.5);
          }
          .error-text {
            color: red;
            font-size: 12px;
          }
          .submit-btn {
            width: 100%;
            padding: 12px;
            background-color: #b22222;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
          }
          .submit-btn:hover {
            background-color: #8b0000;
          }
          @media (max-width: 768px) {
            .signup-image-mobile {
              display: block;
              width: 100px;
              margin: 0 auto 20px;
            }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
};

export default Signup;