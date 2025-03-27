"use client";
import Image from 'next/image'

export default function About () {
    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center" >
                    <div className="bg-yellow-50 p-8 rounded-lg shadow-lg max-w-2xl flex flex-col md:flex-row items-center">
                        <div className="md:w-2/3">
                            <h1 className="text-3xl font-bold mb-4 text-center md:text-left">About Us</h1>
                            <p className="text-lg mb-4">Welcome to our Hindu Matrimony website. We are dedicated to helping you find your perfect match.</p>
                            <p className="text-lg mb-4">Our mission is to provide a safe and secure platform for individuals to connect and build meaningful relationships.</p>
                            <p className="text-lg">Thank you for choosing us as your trusted partner in your search for love and companionship.</p>
                        </div>
                        <div className="md:w-1/3 mt-6 md:mt-0 md:ml-10 flex justify-center">
                            <Image src="/radha.webp" alt="Additional Image" width={300} height={300} className="rounded-lg shadow-lg" />
                        </div>
                    </div>
                </div>
    )
}