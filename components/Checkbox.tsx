import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, id, ...props }) => {
  return (
    <div className="mb-4 flex items-center">
      <input
        type="checkbox"
        id={id}
        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
        {...props}
      />
      <label htmlFor={id} className="ml-2 block text-gray-700 text-sm">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;