
import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'danger';
  className?: string;
}

const Button = ({ 
  type = 'button', 
  onClick, 
  children, 
  variant = 'primary',
  className = '' 
}: ButtonProps) => {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-danger';
  
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
