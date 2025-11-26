import React from 'react';
import { cn } from '../../utils';

const Textarea = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      rows = 4,
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('space-y-1', fullWidth ? 'w-full' : 'w-fit', containerClassName)}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'block w-full rounded-lg border shadow-sm transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500',
            'placeholder:text-gray-400',
            'px-4 py-2.5',
            error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
            className
          )}
          {...props}
        />
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
