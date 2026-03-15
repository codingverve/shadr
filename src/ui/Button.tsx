/**
 * Reusable Button Component
 * 
 * A standardized button component with multiple variants and sizes.
 * Based on the premium "Record" button design.
 */

import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isActive?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'secondary', 
    size = 'md', 
    icon, 
    isActive, 
    fullWidth,
    children, 
    className = '', 
    ...props 
  }, ref) => {
    const classes = [
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      isActive ? 'btn-active' : '',
      fullWidth ? 'btn-full-width' : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={classes} {...props}>
        {icon && <span className="btn-icon">{icon}</span>}
        {children && <span className="btn-label">{children}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
