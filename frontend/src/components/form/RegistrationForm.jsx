import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  FileText,
  MapPin,
  ArrowRight,
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { validateWhatsAppNumber } from "../../utils/validation";
import useTechnologies from "../../hooks/useTechnologies";
import { useSubmitRegistrationMutation } from "../../api/apiSlice.js";
import experienceLevels from "../../constants/experienceLevels";
import internshipTypes from "../../constants/internshipTypes";
import getFlagEmoji from "../../utils/getFlagEmoji";
import FormField from "./FormField";
import CountrySelect from "../selects/CountrySelect";
import TechnologySelect from "../selects/TechnologySelect";
import InternshipTypeSelect from "../selects/InternshipTypeSelect";
import ExperienceSelect from "../selects/ExperienceSelect";
import ServerErrorsDisplay from "../common/ServerErrorsDisplay";
import AnimatedRegistrationCounter from "../common/AnimatedRegistrationCounter";

const RegistrationForm = () => {
  const { technologies, loading, error, retryFetch } = useTechnologies();
  const [submitRegistration] = useSubmitRegistrationMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    cnic: "",
    city: "",
    country: "",
    technology: "",
    internshipType: internshipTypes[0],
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
    whatsapp: /^\+92\d{10}$/,
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
        else if (!validateWhatsAppNumber(value))
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
      whatsapp: country.phoneCode,
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
        },
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
      "Task-Based Internship": 0,
      "Learning-Based Internship": 1,
    };

    setIsSubmitting(true);

    // Show loading toast
    const loadingToast = toast.loading("Submitting your registration...", {
      position: "top-center",
    });

    try {
      const selectedTech = technologies.find(
        (t) => t.id === formData.technology,
      );

      const selectedExp = experienceLevels.find(
        (e) => e.value === formData.experience,
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

      const response = await submitRegistration(submissionData).unwrap();

      console.log(response);

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
        },
      );

      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (err && err.status && typeof err.status === "number") {
        const { status, data } = err;

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
            },
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
      } else if (err && err.status === "FETCH_ERROR") {
        toast.error(
          "Network error. Please check your connection and try again.",
          {
            duration: 4000,
            position: "top-center",
            style: {
              background: "#ef4444",
              color: "white",
            },
          },
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
                  <FormField
                    label="Your Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    icon={User}
                    error={errors.name || serverErrors.name}
                  />

                  {/* Email */}
                  <FormField
                    label="Your Email *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    icon={Mail}
                    error={errors.email || serverErrors.email}
                  />

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
                    <FormField
                      label="CNIC Number *"
                      name="cnic"
                      value={formData.cnic}
                      onChange={handleChange}
                      placeholder="00000-0000000-0"
                      icon={FileText}
                      error={errors.cnic || serverErrors.cnic}
                      maxLength="15"
                    />
                  )}

                  {/* City */}
                  <FormField
                    label="City *"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    icon={MapPin}
                    error={errors.city || serverErrors.city}
                  />

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
                  {formData.internshipType === "Learning-Based Internship" && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                        <strong>Learning-Based Internship Includes:</strong>
                      </p>
                      <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                        <li>✅ Structured Learning-Based Program</li>
                        <li>✅ Affordable Learning & Training Fee</li>
                        <li>✅ Real-World Projects</li>
                        <li>✅ Portfolio & GitHub Setup</li>
                        <li>✅ Mentor Support & Guidance</li>
                        <li>✅ Job & Freelancing Guidance</li>
                        <li>✅ Verified Internship Certificate</li>
                        <li>✅ Top Performers get Recommendation Letter</li>
                      </ul>
                    </div>
                  )}
                  {formData.internshipType === "Task-Based Internship" && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                        <strong>Task-Based Internship Includes:</strong>
                      </p>
                      <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                        <li>✅ Beginner-Friendly Learning Program</li>
                        <li>✅ Practice-Based Tasks & Assignments</li>
                        <li>✅ Platform & Training Fee: PKR 1000</li>
                        <li>✅ Beginner-Level Real-World Projects</li>
                        <li>✅ Weekly Tasks & Progress Tracking</li>
                        <li>✅ 6-Week Internship Completion Certificate</li>
                        <li>✅ Community Support & Mentor Guidance</li>
                        <li>✅ Internship Access & Onboarding Support</li>
                      </ul>
                    </div>
                  )}
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
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
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

                  {/* Security Note */}
                  <div className="flex items-center justify-center pt-4 border-t border-slate-200 dark:border-slate-700 mt-5">
                    <div className="relative flex items-center justify-center">
                      <AnimatedRegistrationCounter />
                    </div>
                  </div>
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

export default RegistrationForm;

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
