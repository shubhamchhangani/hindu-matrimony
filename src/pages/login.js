import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';
import Link from 'next/link';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  const onSubmit = (data) => {
    console.log('Login Data:', data);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/background.webp')" }}>
        <div className="flex flex-col md:flex-row items-center bg-[#f3e5ab] shadow-2xl rounded-2xl w-full max-w-4xl">
          <div className="hidden md:block md:w-1/2">
            <Image src="/ganesha2.webp" alt="Side Image" width={500} height={500} className="w-full h-full object-cover rounded-l-2xl" />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 w-full md:w-1/2">
            <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#b22222]"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                {...register('password')}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#b22222]"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-[#b22222] text-[#fffacd] p-2 rounded hover:bg-[#8b0000] transition duration-300 ease-in-out transform hover:scale-105"
            >
              Login
            </button>
            <Link href="/register" className='mt-3 inline-block text-center w-full text-[#b22222] hover:text-[#8b0000] transition duration-300 ease-in-out'> Don&apos;t have an account? Register here</Link>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;