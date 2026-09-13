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
      <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
        {Icon && <Icon className="w-3.5 h-3.5 text-blue-400" />}
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
        className={`w-full px-4 py-3 bg-slate-800/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none transition-colors duration-200
          ${
            error
              ? "border-red-500/60 focus:border-red-500"
              : "border-slate-700 hover:border-slate-600 focus:border-blue-500"
          }
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}
          ${className}
        `}
        placeholder={placeholder}
      />
      {error && (
        <p className="text-red-400 text-xs mt-1 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;