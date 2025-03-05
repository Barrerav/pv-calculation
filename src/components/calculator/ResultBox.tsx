
import React from 'react';
import { motion } from 'framer-motion';

interface ResultBoxProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  visible: boolean;
  delay?: number;
}

const ResultBox = ({ title, children, className = "", visible, delay = 0 }: ResultBoxProps) => {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`result-box my-6 ${className}`}
    >
      {title && <h3 className="text-xl font-medium text-asme-blue mb-4">{title}</h3>}
      {children}
    </motion.div>
  );
};

export default ResultBox;
