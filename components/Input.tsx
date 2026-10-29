import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string };

export const Input: React.FC<InputProps> = ({ label, id, className = '', ...props }) => {
  const inputId = id || `input-${label.replace(/[^\p{L}\p{N}]+/gu, '-').toLowerCase()}`;
  return (
    <div className="w-full">
      <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input {...props} id={inputId} className={`block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${className}`} />
    </div>
  );
};
