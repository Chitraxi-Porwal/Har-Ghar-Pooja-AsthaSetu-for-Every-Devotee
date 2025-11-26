import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';

const Card = React.forwardRef(
  (
    {
      children,
      className = '',
      hoverable = false,
      shadow = 'md',
      rounded = 'xl',
      ...props
    },
    ref
  ) => {
    const shadowClasses = {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      '2xl': 'shadow-2xl',
      inner: 'shadow-inner',
      none: 'shadow-none',
    };

    const roundedClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
      full: 'rounded-full',
    };

    const Component = hoverable ? motion.div : 'div';

    return (
      <Component
        ref={ref}
        className={cn(
          'bg-white dark:bg-gray-800 overflow-hidden border border-gray-100 dark:border-gray-700',
          shadowClasses[shadow],
          roundedClasses[rounded],
          hoverable && 'transition-all duration-300 hover:shadow-xl',
          className
        )}
        whileHover={hoverable ? { y: -4 } : {}}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-6 py-4 border-b border-gray-100 dark:border-gray-700', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-bold text-gray-900 dark:text-white', className)}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('mt-1 text-sm text-gray-600 dark:text-gray-400', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 py-4', className)} {...props} />
));

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;
