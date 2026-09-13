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
    <div className="font-medium text-white truncate">
      {tech ? tech.name : "Select Technology"}
    </div>
  );

  if (apiError) {
    return (
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
          <Code className="w-3.5 h-3.5 text-blue-400" />
          Technology *
        </label>
        <div className="relative">
          <div className="w-full px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-red-400 text-sm font-medium truncate">
                  Failed to load technologies
                </p>
                <p className="text-red-400/80 text-xs truncate mt-0.5">
                  {apiError}
                </p>
              </div>
              <button
                onClick={onRetry}
                className="ml-3 p-1.5 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                title="Retry"
              >
                <RefreshCw className="w-4 h-4 text-red-400" />
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