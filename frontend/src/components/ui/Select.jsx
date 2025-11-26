import React from 'react';
import { cn } from '../../utils';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder = 'Select an option',
      fullWidth = false,
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
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'block w-full rounded-lg border shadow-sm transition-colors duration-200 appearance-none',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500',
              'pl-4 pr-10 py-2.5',
              error
                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className={cn('h-5 w-5', error ? 'text-red-400' : 'text-gray-400')} />
          </div>
        </div>
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
