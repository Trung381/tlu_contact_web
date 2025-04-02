import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false, 
  className = '',
  ...props 
}) => {
  // Xác định class dựa vào variant
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'accent':
        return 'btn-accent';
      case 'ghost':
        return 'btn-ghost';
      case 'link':
        return 'btn-link';
      case 'outline':
        return 'btn-outline';
      default:
        return 'btn-primary';
    }
  };

  // Xác định class dựa vào size
  const getSizeClasses = () => {
    switch (size) {
      case 'lg':
        return 'btn-lg';
      case 'sm':
        return 'btn-sm';
      case 'xs':
        return 'btn-xs';
      case 'md':
      default:
        return '';
    }
  };

  const baseClasses = 'btn';
  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 