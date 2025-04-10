'use client';

import { motion } from 'framer-motion';

export default function KuldeviCard({ name, gotras, location, description, expanded, onClick }) {
  return (
    <motion.div
      layout
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      className="cursor-pointer p-5 bg-white rounded-2xl border border-[#b22222] shadow-md hover:shadow-lg transition-all"
    >
      <h3 className="text-xl font-bold text-[#b22222] mb-2">{name}</h3>
      <p className="text-sm text-gray-700 mb-2">स्थान: {location}</p>
      {expanded && (
        <div className="text-sm text-gray-800 space-y-2 mt-3">
          <p><strong>संलग्न गोत्र:</strong> {gotras.join(', ')}</p>
          <p><strong>विवरण:</strong> {description}</p>
        </div>
      )}
    </motion.div>
  );
}