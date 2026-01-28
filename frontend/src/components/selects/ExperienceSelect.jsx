import React from "react";
import { TrendingUp, CheckCircle } from "lucide-react";
import CustomSelect from "./CustomSelect";
import experienceLevels from "../../constants/experienceLevels";

const ExperienceSelect = ({ value, onChange, error }) => {
  const getSelectedExperience = () => {
    if (value === undefined || value === null || value === "") return null;
    return experienceLevels.find((exp) => exp.value === value) || null;
  };

  const renderSelectedExperience = (exp) => (
    <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
      {exp ? exp.label : "Select Experience"}
    </div>
  );

  const renderExperienceOption = (exp, selected) => (
    <>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
          {exp.label}
        </div>
      </div>
      {selected && (
        <CheckCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 ml-2 flex-shrink-0" />
      )}
    </>
  );

  return (
    <CustomSelect
      label="Experience *"
      value={getSelectedExperience()}
      onChange={onChange}
      options={experienceLevels}
      placeholder="Select Experience"
      icon={TrendingUp}
      error={error}
      renderSelected={renderSelectedExperience}
      renderOption={renderExperienceOption}
    />
  );
};

export default ExperienceSelect;