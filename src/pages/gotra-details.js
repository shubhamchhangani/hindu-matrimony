'use client';

import { useState } from 'react';
import gotras from '../data/gotra.json';
import GotraCard from '../components/GotraCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function GotraPage() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <>
    <Header />
    <div className="bg-[#f3e5ab] min-h-screen py-10 px-4 sm:px-10">
      <h1 className="text-3xl font-bold text-center text-[#b22222] mb-10">
        श्रिमाली ब्राह्मण गोत्र विवरण
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {gotras.map((gotra, index) => (
          <GotraCard
            key={index}
            gotra={gotra.Gotra}
            kuldevi={gotra.Kuldevi}
            details={gotra.Details}
            expanded={expandedIndex === index}
            onClick={() =>
              setExpandedIndex(expandedIndex === index ? null : index)
            }
          />
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
}