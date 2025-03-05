
import React from 'react';
import { motion } from 'framer-motion';

interface ValueDisplayProps {
  label: string;
  value: string;
  highlight?: boolean;
  delay?: number;
}

const ValueDisplay = ({ label, value, highlight = false, delay = 0 }: ValueDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`flex justify-between items-center p-3 mb-2 rounded-lg border-l-4 
        ${highlight 
          ? 'border-asme-red bg-asme-red/5' 
          : 'border-asme-teal bg-asme-teal/5'}`}
    >
      <span className="font-medium">{label}:</span>
      <span className={`font-mono ${highlight ? 'text-asme-red font-semibold' : 'text-asme-blue'}`}>
        {value}
      </span>
    </motion.div>
  );
};

export default ValueDisplay;
