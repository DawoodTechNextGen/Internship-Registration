import React from "react";
import { Code, RefreshCw } from "lucide-react";
import CustomSelect from "./CustomSelect";

const TechnologySelect = ({
  value,
  onChange,
  error,
  technologies,
  loading,
  onRetry,
  apiError,
}) => {
  const renderSelectedTech = (tech) => (
    <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
      {tech ? tech.name : "Select Technology"}
    </div>
  );

  if (apiError) {
    return (
      <div className="space-y-1.5">
        <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          <Code className="w-4 h-4 mr-2 text-slate-500" />
          Technology *
        </label>
        <div className="relative">
          <div className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium truncate">
                  Failed to load technologies
                </p>
                <p className="text-red-500 dark:text-red-500/80 text-xs truncate mt-0.5">
                  {apiError}
                </p>
              </div>
              <button
                onClick={onRetry}
                className="ml-3 p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                title="Retry"
              >
                <RefreshCw className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CustomSelect
      label="Technology *"
      value={value}
      onChange={onChange}
      options={technologies}
      placeholder="Select Technology"
      icon={Code}
      error={error}
      loading={loading}
      renderSelected={renderSelectedTech}
    />
  );
};

export default TechnologySelect;