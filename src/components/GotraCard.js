'use client';

import { motion } from 'framer-motion';

export default function GotraCard({ gotra, kuldevi, details, expanded, onClick }) {
  return (
    <motion.div
      layout
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      className="cursor-pointer p-5 bg-white rounded-2xl border border-[#b22222] shadow-md hover:shadow-lg transition-all"
    >
      <h3 className="text-xl font-bold text-[#b22222] mb-2">{gotra}</h3>
      <p className="text-sm text-gray-700 mb-2">कुलदेवी: {kuldevi}</p>
      {expanded && (
        <div className="text-sm text-gray-800 space-y-1 mt-3">
          <p><strong>प्रवर:</strong> {details.Pravar}</p>
          <p><strong>वेद:</strong> {details.Veda}</p>
          <p><strong>शाखा:</strong> {details.Shakha}</p>
        </div>
      )}
    </motion.div>
  );
}