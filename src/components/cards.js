'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    title: 'श्रिमाली ब्राह्मण गोत्र विवरण (Gotra Details)',
    description: 'श्रिमाली समाज के प्रमुख गोत्रों की विस्तृत जानकारी देखें।',
    link: '/gotra-details',
  },
  {
    title: 'कुलदेवियाँ (Kuldevis)',
    description: 'श्रिमाली समाज की पूज्य कुलदेवियों की जानकारी पाएं।',
    link: '/kuldevi',
  },
  {
    title: 'प्रमुख धर्मशालाएं (Dharamshalas)',
    description: 'भारत भर में स्थित श्रिमाली समाज की प्रसिद्ध धर्मशालाओं की सूची।',
    link: '/dharamshalas',
  },
];

export default function Cards() {
  return (
    <div className="bg-[#f3e5ab] py-10 px-4 sm:px-10">
      <h2 className="text-3xl font-bold text-center text-[#b22222] mb-8">
        Explore श्रिमाली समाज Features
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-2xl shadow-lg bg-white p-6 transition-all border border-[#b22222]"
          >
            <h3 className="text-xl font-semibold text-[#b22222] mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-700 mb-4">{feature.description}</p>
            <Link
              href={feature.link}
              className="text-white bg-[#b22222] px-4 py-2 rounded-lg hover:bg-[#a01f1f] transition-colors"
            >
              और जानें →
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
