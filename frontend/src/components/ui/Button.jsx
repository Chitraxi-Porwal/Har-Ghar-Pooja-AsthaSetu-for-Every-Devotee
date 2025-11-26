import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';

const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      fullWidth = false,
      isLoading = false,
      disabled = false,
      className = '',
      as: Component = 'button',
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-md hover:shadow-lg',
      secondary:
        'bg-white text-primary-700 border-2 border-primary-200 hover:bg-primary-50 hover:border-primary-300 focus:ring-primary-500',
      outline:
        'border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
      ghost: 'bg-transparent hover:bg-primary-50 text-primary-600 focus:ring-primary-500',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-md',
      success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-md',
      link: 'bg-transparent text-primary-600 hover:text-primary-800 hover:underline p-0 h-auto',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
      xl: 'h-16 px-10 text-xl',
    };

    const MotionComponent = motion[Component] || motion.button;

    return (
      <MotionComponent
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon className="h-5 w-5 mr-2" />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className="h-5 w-5 ml-2" />}
          </>
        )}
      </MotionComponent>
    );
  }
);

Button.displayName = 'Button';

export default Button;
