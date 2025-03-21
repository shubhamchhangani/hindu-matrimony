import React from 'react';

export default function Profile() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="font-medium">Name:</span>
                        <span>John Doe</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-medium">Email:</span>
                        <span>john.doe@example.com</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-medium">Member Since:</span>
                        <span>January 2023</span>
                    </div>
                    {/* Add more profile details as needed */}
                </div>
            </div>
        </div>
    );
}