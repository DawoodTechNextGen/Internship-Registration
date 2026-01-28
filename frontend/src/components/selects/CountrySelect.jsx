import React from "react";
import { Globe, CheckCircle } from "lucide-react";
import CustomSelect from "./CustomSelect";
import countries from "../../constants/countries";
import getFlagEmoji from "../../utils/getFlagEmoji";

const CountrySelect = ({ selectedCountry, onSelect, error }) => {
  const renderSelectedCountry = (country) => {
    if (!country) return null;
    return (
      <div className="flex items-center min-w-0">
        <span className="text-xl mr-3 flex-shrink-0 text-gray-300">
          {getFlagEmoji(country.code)}
        </span>
        <div className="min-w-0">
          <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
            {country.name}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {country.phoneCode}
          </div>
        </div>
      </div>
    );
  };

  const renderCountryOption = (country, selected) => (
    <>
      <span className="text-xl mr-3 flex-shrink-0 text-gray-300">
        {getFlagEmoji(country.code)}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
          {country.name}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {country.phoneCode}
          {country.cnic && " • CNIC required"}
        </div>
      </div>
      {selected && (
        <CheckCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 ml-2 flex-shrink-0" />
      )}
    </>
  );

  return (
    <CustomSelect
      label="Country *"
      value={selectedCountry}
      onChange={onSelect}
      options={countries}
      placeholder="Select your country"
      icon={Globe}
      error={error}
      searchable={true}
      renderSelected={renderSelectedCountry}
      renderOption={renderCountryOption}
    />
  );
};

export default CountrySelect;