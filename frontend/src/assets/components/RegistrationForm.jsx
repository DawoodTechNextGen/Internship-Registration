import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  FileText,
  MapPin,
  Globe,
  Code,
  Briefcase,
  TrendingUp,
  CheckCircle,
  ChevronDown,
  Search,
  ArrowRight,
  Shield,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

// All countries data
const allCountries = [
  { name: "Pakistan", code: "PK", phoneCode: "+92", cnic: true },
  { name: "India", code: "IN", phoneCode: "+91", cnic: false },
  { name: "United States", code: "US", phoneCode: "+1", cnic: false },
  { name: "United Kingdom", code: "GB", phoneCode: "+44", cnic: false },
  { name: "Canada", code: "CA", phoneCode: "+1", cnic: false },
  { name: "Australia", code: "AU", phoneCode: "+61", cnic: false },
  { name: "United Arab Emirates", code: "AE", phoneCode: "+971", cnic: false },
  { name: "Saudi Arabia", code: "SA", phoneCode: "+966", cnic: false },
  { name: "Germany", code: "DE", phoneCode: "+49", cnic: false },
  { name: "France", code: "FR", phoneCode: "+33", cnic: false },
  { name: "China", code: "CN", phoneCode: "+86", cnic: false },
];

const getFlagEmoji = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

// API Configuration
const API_CONFIG = {
  BASE_URL: "https://internship.dawoodtechnextgen.org/api",
  ENDPOINTS: {
    TECHNOLOGIES: "/technologies",
    SUBMIT_FORM: "/registration",
  },
  // TIMEOUT: 5000,
};

// Custom hook for fetching technologies
const useTechnologies = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchTechnologies = async (retry = 0) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TECHNOLOGIES}`,
        {
          timeout: API_CONFIG.TIMEOUT,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.data &&
        response.data.techs &&
        Array.isArray(response.data)
      ) {
        setTechnologies(response.data);
      } else {
        setTechnologies(response.data);
      }
    } catch (err) {
      console.error("Error fetching technologies:", err);

      if (err.code === "ECONNABORTED") {
        setError("Request timeout. Please check your connection.");
      } else if (err.response) {
        setError(
          `Server error: ${err.response.status} - ${err.response.statusText}`
        );
      } else if (err.request) {
        setError("Cannot connect to server. Please ensure the API is running.");
      } else {
        setError("Failed to load technologies. Please try again.");
      }

      if (retry < 2) {
        setTimeout(() => {
          fetchTechnologies(retry + 1);
        }, 1000 * (retry + 1));
      }
    } finally {
      setLoading(false);
    }
  };

 

  useEffect(() => {
    fetchTechnologies();
  }, [retryCount]);

  const retryFetch = () => {
    setRetryCount((prev) => prev + 1);
  };

  return { technologies, loading, error, retryFetch };
};

const internshipTypes = ["Internship Only", "Full Training + Internship"];
const experienceLevels = [
  { label: "I don't have any Experience", value: 0 },
  { label: "6 Months", value: 1 },
  { label: "1 Year", value: 2 },
  { label: "2 Years", value: 3 },
  { label: "More than 2 Years", value: 4 },
];

// Reusable Custom Select Component
const CustomSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  icon: Icon,
  error,
  loading = false,
  searchable = false,
  renderOption = null,
  renderSelected = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (searchable && searchTerm) {
      const filtered = options.filter((option) => {
        const optionText = getOptionText(option);
        return optionText.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options, searchable]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getOptionText = (option) => {
    if (!option) return "";
    if (typeof option === "string") return option;
    return option.name || option.label || String(option);
  };

  const getOptionValue = (option) => {
    if (!option) return null;
    if (typeof option === "string") return option;
    return option.value || option.id || option;
  };

  const isOptionSelected = (option) => {
    if (!value) return false;
    const optionValue = getOptionValue(option);
    const currentValue =
      typeof value === "object" ? getOptionValue(value) : value;
    return optionValue === currentValue;
  };

  const getSelectedOption = () => {
    if (!value) return null;

    // If value is a string, find matching option
    if (typeof value === "string") {
      return options.find((option) => getOptionValue(option) === value);
    }

    // If value is an object, check if it exists in options
    const valueKey = getOptionValue(value);
    return (
      options.find((option) => getOptionValue(option) === valueKey) || value
    );
  };

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {Icon && <Icon className="w-4 h-4 mr-2 text-slate-500" />}
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !loading && setIsOpen(!isOpen)}
          disabled={loading}
          className={`w-full px-4 py-3 bg-white dark:bg-slate-800 border rounded-xl text-left flex items-center justify-between transition-all duration-200
            ${
              error
                ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900"
                : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
            }
            ${
              isOpen
                ? "ring-2 ring-blue-100 dark:ring-blue-900 border-blue-500 dark:border-blue-400"
                : ""
            }
            ${loading ? "opacity-70 cursor-not-allowed" : ""}
          `}
        >
          <div className="flex items-center min-w-0 flex-1">
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin mr-3" />
                <span className="text-slate-500 dark:text-slate-400">
                  Loading...
                </span>
              </div>
            ) : value ? (
              renderSelected ? (
                renderSelected(getSelectedOption())
              ) : (
                <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                  {getOptionText(getSelectedOption()) || getOptionText(value)}
                </div>
              )
            ) : (
              <span className="text-slate-400 dark:text-slate-500">
                {placeholder}
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? "rotate-180" : ""
            } ${loading ? "opacity-50" : ""}`}
          />
        </button>

        {isOpen && !loading && (
          <div className="absolute z-50 w-full mt-1 text-gray-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 max-h-80 overflow-hidden animate-slideDown">
            {searchable && (
              <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    autoFocus
                  />
                </div>
              </div>
            )}

            <div className="overflow-y-auto max-h-40 custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-center text-slate-500 dark:text-slate-400">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const selected = isOptionSelected(option);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`w-full px-4 py-3 text-left transition-colors duration-150 flex items-center hover:bg-slate-50 dark:hover:bg-slate-700/50
                        ${selected ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                      `}
                    >
                      {renderOption ? (
                        renderOption(option, selected)
                      ) : (
                        <>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                              {getOptionText(option)}
                            </div>
                          </div>
                          {selected && (
                            <CheckCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 ml-2 flex-shrink-0" />
                          )}
                        </>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 dark:text-red-400 text-xs mt-1 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

// Country Select Component using CustomSelect
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
      options={allCountries}
      placeholder="Select your country"
      icon={Globe}
      error={error}
      searchable={true}
      renderSelected={renderSelectedCountry}
      renderOption={renderCountryOption}
    />
  );
};

// Technology Select Component
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

// Internship Type Select Component
const InternshipTypeSelect = ({ value, onChange, error }) => {
  const renderSelectedType = (type) => (
    <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
      {type || "Select Type"}
    </div>
  );

  return (
    <CustomSelect
      label="Internship Type *"
      value={value}
      onChange={onChange}
      options={internshipTypes}
      placeholder="Select Type"
      icon={Briefcase}
      error={error}
      renderSelected={renderSelectedType}
    />
  );
};

// Experience Select Component
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

// Server Error Display Component
const ServerErrorsDisplay = ({ errors }) => {
  if (!errors || Object.keys(errors).length === 0) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-fadeIn">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-red-800 dark:text-red-300 font-semibold text-sm mb-2">
            Please fix the following errors:
          </h3>
          <ul className="space-y-1">
            {Object.entries(errors).map(([field, message]) => (
              <li
                key={field}
                className="text-red-700 dark:text-red-400 text-sm"
              >
                <span className="font-medium capitalize">{field}:</span>{" "}
                {message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const RegistrationForm = () => {
  const { technologies, loading, error, retryFetch } = useTechnologies();

  

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    cnic: "",
    city: "",
    country: "",
    technology: "",
    internshipType: "",
    experience: "",
  });

  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const validationPatterns = {
    name: /^[a-zA-Z\s]{2,50}$/,
    email: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
    whatsapp: /^\+[\d\s]{8,15}$/,
    cnic: /^\d{5}-\d{7}-\d{1}$/,
    city: /^[a-zA-Z\s]{2,30}$/,
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (!validationPatterns.name.test(value))
          error = "Name must be 2-50 characters, letters only";
        break;

      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!validationPatterns.email.test(value))
          error = "Only Gmail addresses are allowed";
        break;

      case "country":
        if (!selectedCountry) error = "Please select your country";
        break;

      case "whatsapp":
        if (!value.trim()) error = "WhatsApp number is required";
        else if (!selectedCountry) error = "Select country first";
        else if (!validationPatterns.whatsapp.test(value))
          error = "Please enter a valid WhatsApp number";
        break;

      case "cnic":
        if (selectedCountry?.cnic) {
          if (!value.trim()) error = "CNIC is required for Pakistan";
          else if (!validationPatterns.cnic.test(value))
            error = "Format: 00000-0000000-0";
        }
        break;

      case "city":
        if (!value.trim()) error = "City is required";
        else if (!validationPatterns.city.test(value))
          error = "Please enter a valid city name";
        break;

      case "technology":
        if (!value || value === "") error = "Technology selection is required";
        break;

      case "internshipType":
        if (!value || value === "") error = "Internship type is required";
        break;

      case "experience":
        if (value === undefined || value === null || value === "")
          error = "Experience selection is required";
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cnic" && selectedCountry?.cnic) {
      let digits = value.replace(/\D/g, "").slice(0, 13);
      let formatted = digits;
      if (digits.length > 5)
        formatted = digits.slice(0, 5) + "-" + digits.slice(5);
      if (digits.length > 12)
        formatted =
          digits.slice(0, 5) +
          "-" +
          digits.slice(5, 12) +
          "-" +
          digits.slice(12);

      setFormData((prev) => ({ ...prev, cnic: formatted }));

      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, formatted),
      }));
      setServerErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        delete newErrors[name === "whatsapp" ? "mbl_number" : name];
        return newErrors;
      });
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    setServerErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      delete newErrors[name === "whatsapp" ? "mbl_number" : name];
      return newErrors;
    });
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setFormData((prev) => ({
      ...prev,
      country: country.name,
      whatsapp: country.phoneCode + " ",
    }));

    setErrors((prev) => ({ ...prev, country: "" }));
    setServerErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.country;
      return newErrors;
    });

    if (!country.cnic) {
      setFormData((prev) => ({ ...prev, cnic: "" }));
    }
  };

  const handleSelectChange = (name, value) => {
    if (name === "technology") {
      if (value && typeof value === "object") {
        setFormData((prev) => ({
          ...prev,
          [name]: value.id,
        }));
        setErrors((prev) => ({
          ...prev,
          [name]: validateField(name, value.id),
        }));
        setServerErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    } else if (name === "experience") {
      if (value && typeof value === "object") {
        setFormData((prev) => ({
          ...prev,
          [name]: value.value,
        }));
        setErrors((prev) => ({
          ...prev,
          [name]: validateField(name, value.value),
        }));
        setServerErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    } else {
      let optionValue;
      if (typeof value === "object") {
        optionValue = value.name || value.label || value.value || value;
      } else {
        optionValue = value;
      }

      setFormData((prev) => ({ ...prev, [name]: optionValue }));
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, optionValue),
      }));
      setServerErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      toast.error("Please wait while technologies are loading...", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "white",
        },
      });
      return;
    }

    if (error) {
      toast.error(
        "Cannot submit form while technologies are unavailable. Please try refreshing.",
        {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#ef4444",
            color: "white",
          },
        }
      );
      return;
    }

    setServerErrors({});

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key === "country") {
        const error = validateField(key, selectedCountry?.name || "");
        if (error) newErrors[key] = error;
      } else if (key === "technology") {
        if (!formData.technology || formData.technology === "") {
          newErrors[key] = "Technology selection is required";
        }
      } else if (key === "experience") {
        if (formData.experience === "" || formData.experience === undefined) {
          newErrors[key] = "Experience selection is required";
        }
      } else {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      const firstError = Object.keys(newErrors)[0];
      const errorElement = document.querySelector(`[name="${firstError}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // Show toast for validation errors
      toast.error("All Fields are required!!", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "white",
        },
      });

      return;
    }

    const internshipTypeMap = {
      "Internship Only": 0,
      "Full Training + Internship": 1,
    };

    setIsSubmitting(true);

    // Show loading toast
    const loadingToast = toast.loading("Submitting your registration...", {
      position: "top-center",
    });

    try {
      const selectedTech = technologies.find(
        (t) => t.id === formData.technology
      );

      const selectedExp = experienceLevels.find(
        (e) => e.value === formData.experience
      );

      const submissionData = {
        name: formData.name,
        email: formData.email,
        country: selectedCountry?.name || "",
        mbl_number: formData.whatsapp.replace(/\s/g, ""),
        city: formData.city,
        cnic: formData.cnic,
        technology: formData.technology,
        Internship_type: internshipTypeMap[formData.internshipType] ?? 0,
        experience: formData.experience,
        technology_name: selectedTech?.name || "",
        experience_label: selectedExp?.label || "",
      };

     

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUBMIT_FORM}`,
        submissionData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

     

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(
        "Registration successful! We'll contact you on WhatsApp within 24 hours.",
        {
          duration: 5000,
          position: "top-center",
          style: {
            background: "#10b981",
            color: "white",
          },
          icon: "🎉",
        }
      );

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 422 && data.errors) {
          const serverValidationErrors = {};

          Object.keys(data.errors).forEach((field) => {
            let formField;
            switch (field) {
              case "mbl_number":
                formField = "whatsapp";
                break;
              default:
                formField = field;
            }

            serverValidationErrors[formField] = data.errors[field].join(", ");
          });

          setServerErrors(serverValidationErrors);

          const firstError = Object.keys(serverValidationErrors)[0];
          const errorElement = document.querySelector(`[name="${firstError}"]`);
          if (errorElement) {
            errorElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }

          // Show toast for server validation errors
          toast.error(
            data.message || "Please fix the errors below and try again.",
            {
              duration: 5000,
              position: "top-center",
              style: {
                background: "#ef4444",
                color: "white",
              },
            }
          );
        } else if (status === 400) {
          toast.error(data.message || "Bad request. Please check your input.", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "#ef4444",
              color: "white",
            },
          });
        } else if (status === 500) {
          toast.error("Server error. Please try again later.", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "#ef4444",
              color: "white",
            },
          });
        } else {
          toast.error(data.message || "Submission failed. Please try again.", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "#ef4444",
              color: "white",
            },
          });
        }
      } else if (error.request) {
        toast.error(
          "Network error. Please check your connection and try again.",
          {
            duration: 4000,
            position: "top-center",
            style: {
              background: "#ef4444",
              color: "white",
            },
          }
        );
      } else {
        toast.error("An error occurred. Please try again.", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#ef4444",
            color: "white",
          },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: "",
      email: "",
      whatsapp: "",
      cnic: "",
      city: "",
      country: "",
      technology: "",
      internshipType: "",
      experience: "",
    });
    setSelectedCountry(null);
    setErrors({});
    setServerErrors({});
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-700 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 right-40">
              <div className="absolute -inset-4 rounded-full bg-green-400/30 animate-ripple-1"></div>
              <div className="absolute -inset-4 rounded-full bg-green-400/20 animate-ripple-2"></div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                Registration Complete!
              </h1>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                Thank you for registering
              </h2>
            </div>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We'll contact you on WhatsApp within 24 hours with next steps.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 mx-auto"
          >
            Register Another Person
            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 5000,
            style: {
              background: "#10b981",
              color: "white",
            },
          },
          error: {
            duration: 5000,
            style: {
              background: "#ef4444",
              color: "white",
            },
          },
          loading: {
            duration: Infinity,
            style: {
              background: "#3b82f6",
              color: "white",
            },
          },
        }}
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 px-4 py-8">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 dark:bg-blue-700 rounded-full blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-pink-500 dark:bg-pink-700 rounded-full blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-purple-500 dark:bg-purple-700 rounded-full blur-xl opacity-20 animate-pulse delay-500"></div>

        <div className="w-full max-w-4xl">
          <div className="text-center mb-8 max-w-xl mx-auto">
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              Internship Registration DawoodTech NextGen Pakistan
            </h1>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="p-8">
              <ServerErrorsDisplay errors={serverErrors} />

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      <User className="w-4 h-4 mr-2 text-slate-500" />
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 text-gray-300 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none transition-all duration-200
                        ${
                          errors.name || serverErrors.name
                            ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900"
                            : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                        }
                      `}
                      placeholder="Name"
                    />
                    {(errors.name || serverErrors.name) && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1 animate-fadeIn">
                        {errors.name || serverErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      <Mail className="w-4 h-4 mr-2 text-slate-500" />
                      Your Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 text-gray-300 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none transition-all duration-200
                        ${
                          errors.email || serverErrors.email
                            ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900"
                            : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                        }
                      `}
                      placeholder="example@gmail.com"
                    />
                    {(errors.email || serverErrors.email) && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1 animate-fadeIn">
                        {errors.email || serverErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Country */}
                  <CountrySelect
                    selectedCountry={selectedCountry}
                    onSelect={handleCountrySelect}
                    error={errors.country || serverErrors.country}
                  />

                  {/* WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      <Phone className="w-4 h-4 mr-2 text-slate-500" />
                      WhatsApp Number *
                    </label>
                    <div className="flex">
                      {selectedCountry && (
                        <div
                          className={`flex items-center px-3 border border-r-0 rounded-l-xl bg-slate-50 dark:bg-slate-700
                          ${
                            errors.whatsapp || serverErrors.whatsapp
                              ? "border-red-300 dark:border-red-700"
                              : "border-slate-300 dark:border-slate-600"
                          }
                        `}
                        >
                          <span className="text-lg mr-2 text-gray-300">
                            {getFlagEmoji(selectedCountry.code)}
                          </span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {selectedCountry.phoneCode}
                          </span>
                        </div>
                      )}
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        disabled={!selectedCountry}
                        placeholder={
                          selectedCountry
                            ? "Enter your number"
                            : "Select country first"
                        }
                        className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none transition-all duration-200
                          ${
                            errors.whatsapp || serverErrors.whatsapp
                              ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900"
                              : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                          }
                          ${selectedCountry ? "rounded-l-none" : ""}
                          ${
                            !selectedCountry
                              ? "bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                              : "text-slate-900 dark:text-slate-100"
                          }
                        `}
                      />
                    </div>
                    {(errors.whatsapp || serverErrors.whatsapp) && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1 animate-fadeIn">
                        {errors.whatsapp || serverErrors.whatsapp}
                      </p>
                    )}
                  </div>

                  {/* CNIC */}
                  {selectedCountry?.cnic && (
                    <div className="space-y-1.5">
                      <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        <FileText className="w-4 h-4 mr-2 text-slate-500" />
                        CNIC Number *
                      </label>
                      <input
                        type="text"
                        name="cnic"
                        value={formData.cnic}
                        onChange={handleChange}
                        maxLength="15"
                        className={`w-full px-4 py-3 text-gray-300 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none transition-all duration-200
                          ${
                            errors.cnic || serverErrors.cnic
                              ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900"
                              : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                          }
                        `}
                        placeholder="00000-0000000-0"
                      />
                      {(errors.cnic || serverErrors.cnic) && (
                        <p className="text-red-500 dark:text-red-400 text-xs mt-1 animate-fadeIn">
                          {errors.cnic || serverErrors.cnic}
                        </p>
                      )}
                    </div>
                  )}

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 text-gray-300 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none transition-all duration-200
                        ${
                          errors.city || serverErrors.city
                            ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900"
                            : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                        }
                      `}
                      placeholder="Enter your city"
                    />
                    {(errors.city || serverErrors.city) && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1 animate-fadeIn">
                        {errors.city || serverErrors.city}
                      </p>
                    )}
                  </div>

                  {/* Technology */}
                  <TechnologySelect
                    value={formData.technology}
                    onChange={(value) =>
                      handleSelectChange("technology", value)
                    }
                    error={errors.technology || serverErrors.technology}
                    technologies={technologies}
                    loading={loading}
                    apiError={error}
                    onRetry={retryFetch}
                  />

                  {/* Internship Type */}
                  <InternshipTypeSelect
                    value={formData.internshipType}
                    onChange={(value) =>
                      handleSelectChange("internshipType", value)
                    }
                    error={errors.internshipType || serverErrors.internshipType}
                  />

                  {/* Experience */}
                  <ExperienceSelect
                    value={formData.experience}
                    onChange={(value) =>
                      handleSelectChange("experience", value)
                    }
                    error={errors.experience || serverErrors.experience}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || loading || error}
                    className={`group px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center
                      ${
                        isSubmitting || loading || error
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:from-blue-700 hover:to-blue-800 cursor-pointer"
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </span>
                    ) : loading ? (
                      <span className="flex items-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Loading Technologies...
                      </span>
                    ) : error ? (
                      <span className="flex items-center">
                        Technologies Unavailable
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Register Now
                        <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </button>
                </div>

                {/* Security Note */}
                <div className="flex items-center justify-center pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Shield className="w-4 h-4 text-blue-500 dark:text-blue-400 mr-2" />
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Your information is secure and will only be used for
                    internship coordination
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Add animations
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes ripple {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-slideDown {
  animation: slideDown 0.2s ease-out;
}

.animate-ripple-1 {
  animation: ripple 2s infinite linear;
}

.animate-ripple-2 {
  animation: ripple 2s infinite linear 1s;
}

/* Enhanced Modern Dark Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.1);
  border-radius: 10px;
  margin: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(
    180deg,
    rgba(59, 130, 246, 0.5) 0%,
    rgba(96, 165, 250, 0.3) 50%,
    rgba(59, 130, 246, 0.5) 100%
  );
  border-radius: 10px;
  border: 2px solid rgba(30, 41, 59, 0.5);
  box-shadow: 
    0 0 10px rgba(59, 130, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}

.custom-scrollbar::-webkit-scrollbar-thumb::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 100%
  );
  border-radius: 10px 10px 0 0;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    180deg,
    rgba(96, 165, 250, 0.6) 0%,
    rgba(147, 197, 253, 0.4) 50%,
    rgba(96, 165, 250, 0.6) 100%
  );
  box-shadow: 
    0 0 15px rgba(59, 130, 246, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
}

.custom-scrollbar::-webkit-scrollbar-thumb:active {
  background: linear-gradient(
    180deg,
    rgba(37, 99, 235, 0.7) 0%,
    rgba(59, 130, 246, 0.5) 50%,
    rgba(37, 99, 235, 0.7) 100%
  );
}

/* Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(59, 130, 246, 0.5) rgba(15, 23, 42, 0.1);
}

/* Corner */
.custom-scrollbar::-webkit-scrollbar-corner {
  background: transparent;
}

/* Smooth scrolling with momentum */
.custom-scrollbar {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

/* Hide scrollbar when not needed */
.custom-scrollbar {
  overflow-y: auto;
  overflow-y: overlay;
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default RegistrationForm;
