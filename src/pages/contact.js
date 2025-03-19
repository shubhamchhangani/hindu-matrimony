import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

const Contact = () => {
    return (
        <div className=" min-h-screen flex flex-col " style={{ backgroundImage: "url('/background.webp')" }}>
            <Head>
                <title>Contact Us</title>
            </Head>
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center p-4">
                <div className=" bg-yellow-50 shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
                    <div className="md:w-1/2">
                        <Image
                            src="/radha.webp"
                            alt="Contact Us"
                            width={500}
                            height={500}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-6 md:w-1/2">
                        <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" id="name" name="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#b22222] focus:border-[#b22222] sm:text-sm" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="email" name="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#b22222] focus:border-[#b22222] sm:text-sm" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea id="message" name="message" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#b22222] focus:border-[#b22222] sm:text-sm"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-[#b22222] text-[#fffacd] py-2 px-4 rounded-md hover:bg-[#8b0000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b22222]">Submit</button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
