'use client';

import { motion } from 'framer-motion';

export default function DharamshalaCard({ name, location, address, manager, contact, dharamshalaContact, facilities, description, expanded, onClick }) {
  return (
    <motion.div
      layout
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      className="cursor-pointer p-5 bg-white rounded-2xl border border-[#b22222] shadow-md hover:shadow-lg transition-all"
    >
      <h3 className="text-xl font-bold text-[#b22222] mb-2">{name}</h3>
      <p className="text-sm text-gray-700 mb-1">स्थान: {location}</p>
      <p className="text-sm text-gray-700 mb-2">पता: {address}</p>
      {expanded && (
        <div className="text-sm text-gray-800 space-y-2 mt-3">
          <p><strong>प्रबंधक:</strong> राष्ट्रपति: {manager.President}, सचिव: {manager.Secretary}, कोषाध्यक्ष: {manager.Treasurer}</p>
          <p><strong>धर्मशाला संपर्क:</strong> {dharamshalaContact}</p>
          <p><strong>प्रबंधक संपर्क:</strong> {contact}</p>
          <p><strong>सुविधाएँ:</strong> {facilities.join(', ')}</p>
          <p><strong>विवरण:</strong> {description}</p>
        </div>
      )}
    </motion.div>
  );
}