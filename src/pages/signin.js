'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import supabase from '../utils/supabase/client';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [resendSuccess, setResendSuccess] = useState(null);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signIn(email, password);
      router.push('/feed');
    } catch (signInError) {
      if (signInError.message === 'Email not confirmed') {
        setError('Email not confirmed. Please check your inbox for the confirmation email.');
      } else {
        setError(signInError.message);
      }
    }
  };

  const handleResendVerification = async () => {
    const { error: resendError } = await supabase.auth.resend({ type: "signup",
        email: email, });
    if (resendError) {
      setError(resendError.message);
    } else {
      setResendSuccess('Verification email resent. Please check your inbox.');
    }
  };

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center mx-5"
        style={{ backgroundImage: "url('/background.webp')" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-center bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl relative overflow-hidden"
        >
          {/* Desktop Image */}
          <div className="hidden md:block w-1/2 relative h-[600px]">
            <Image 
              src="/radha.webp" 
              alt="Sign In"
              fill
              className="object-cover rounded-l-2xl"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Mobile Image */}
          <div className="block md:hidden w-full mb-6">
            <div className="relative h-[200px] w-full">
              <Image 
                src="/radha.webp" 
                alt="Sign In"
                fill
                className="object-cover rounded-t-2xl"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-center mb-8 text-[#b22222]">Welcome Back</h2>
              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#b22222]">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#b22222]">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="error-text"
                  >
                    {error}
                  </motion.p>
                )}
                {resendSuccess && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="success-text"
                  >
                    {resendSuccess}
                  </motion.p>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="submit-btn"
                >
                  Sign In
                </motion.button>
                {error === 'Email not confirmed. Please check your inbox for the confirmation email.' && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleResendVerification}
                    className="resend-btn"
                  >
                    Resend Verification Email
                  </motion.button>
                )}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-center mt-6"
                >
                  <Link href="/register" className="nav-btn text-center">
                    Don&apos;t have an account? Register
                  </Link>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 12px;
          margin-bottom: 10px;
          border: 2px solid #b22222;
          border-radius: 8px;
          background-color: #f3e5ab;
          color: #b22222;
          transition: all 0.3s;
          font-size: 16px;
        }
        .input-field:focus {
          border-color: #8b0000;
          box-shadow: 0px 0px 12px rgba(178, 34, 34, 0.3);
          transform: translateY(-1px);
        }
        .error-text {
          color: #dc2626;
          font-size: 14px;
          margin-top: 4px;
        }
        .success-text {
          color: #059669;
          font-size: 14px;
          margin-top: 4px;
        }
        .submit-btn, .resend-btn {
          width: 100%;
          padding: 14px;
          background-color: #b22222;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 10px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .submit-btn:hover, .resend-btn:hover {
          background-color: #8b0000;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 0, 0, 0.2);
        }
        .nav-btn {
          padding: 12px 24px;
          background-color: transparent;
          color: #b22222;
          border: 2px solid #b22222;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 600;
        }
        .nav-btn:hover {
          background-color: #b22222;
          color: white;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .submit-btn, .resend-btn {
            padding: 12px;
          }
        }
      `}</style>
      <Footer />
    </>
  );
};

export default SignIn;