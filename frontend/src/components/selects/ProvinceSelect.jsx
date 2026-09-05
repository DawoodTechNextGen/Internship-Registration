import React from "react";
import { Map } from "lucide-react";
import CustomSelect from "./CustomSelect";
import provinces from "../../constants/provinces";

const ProvinceSelect = ({ value, onChange, error }) => {
  // Set default value to the disabled placeholder if no value provided
  const currentValue = value || provinces[0];

  const renderSelectedProvince = (province) => (
    <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
      {province?.label || province || "Select Province"}
    </div>
  );

  return (
    <CustomSelect
      label="Province *"
      value={currentValue}
      onChange={onChange}
      options={provinces}
      placeholder="Select Province"
      icon={Map}
      error={error}
      renderSelected={renderSelectedProvince}
    />
  );
};

export default ProvinceSelect;
