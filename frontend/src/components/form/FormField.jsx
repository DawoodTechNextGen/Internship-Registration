import React from "react";

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  disabled = false,
  maxLength,
  className = "",
}) => {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {Icon && <Icon className="w-4 h-4 mr-2 text-slate-500" />}
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
        className={`w-full px-4 py-3 text-gray-300 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none transition-all duration-200
          ${
            error
              ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900"
              : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
          }
          ${className}
        `}
        placeholder={placeholder}
      />
      {error && (
        <p className="text-red-500 dark:text-red-400 text-xs mt-1 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;