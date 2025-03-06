
import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'danger' | 'secondary';
  className?: string;
}

const Button = ({ 
  type = 'button', 
  onClick, 
  children, 
  variant = 'primary',
  className = '' 
}: ButtonProps) => {
  let baseClass = 'btn-primary';
  
  switch(variant) {
    case 'danger':
      baseClass = 'btn-danger';
      break;
    case 'secondary':
      baseClass = 'btn-secondary';
      break;
    default:
      baseClass = 'btn-primary';
  }
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`${baseClass} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
