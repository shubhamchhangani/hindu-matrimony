'use client';

import { useState } from 'react';
import dharamshalas from '../data/dharamshala.json';
import DharamshalaCard from '../components/DharamshalaCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function DharamshalaPage() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <>
    <Header />
    <div className="bg-[#f3e5ab] min-h-screen py-10 px-4 sm:px-10">
      <h1 className="text-3xl font-bold text-center text-[#b22222] mb-10">
        श्रिमाली समाज धर्मशालाएँ
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dharamshalas.map((dharamshala, index) => (
          <DharamshalaCard
            key={index}
            name={dharamshala.Name}
            location={dharamshala.Location}
            address={dharamshala.Address}
            manager={dharamshala.Manager}
            contact={dharamshala.ContactNumber}
            dharamshalaContact={dharamshala.DharamshalaContact}
            facilities={dharamshala.Facilities}
            description={dharamshala.Description}
            expanded={expandedIndex === index}
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
}
