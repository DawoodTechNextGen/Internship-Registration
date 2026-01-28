import React from "react";
import { Briefcase } from "lucide-react";
import CustomSelect from "./CustomSelect";
import internshipTypes from "../../constants/internshipTypes";

const InternshipTypeSelect = ({ value, onChange, error }) => {
  // Set default value to the disabled placeholder if no value provided
  const currentValue = value || internshipTypes[0];

  const renderSelectedType = (type) => (
    <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
      {type?.label || type || "Select Type"}
    </div>
  );

  return (
    <CustomSelect
      label="Internship Type *"
      value={currentValue}
      onChange={onChange}
      options={internshipTypes}
      placeholder="Select Type"
      icon={Briefcase}
      error={error}
      renderSelected={renderSelectedType}
    />
  );
};

export default InternshipTypeSelect;