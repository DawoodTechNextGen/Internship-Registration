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
  CheckCircle,
} from "lucide-react";
import { useSubmitBootcampRegistrationMutation } from "../../api/apiSlice.js";
import FormField from "./FormField";
import ProvinceSelect from "../selects/ProvinceSelect";
import ServerErrorsDisplay from "../common/ServerErrorsDisplay";

const PHONE_CODE = "+92";

const BootcampRegistrationForm = () => {
  const [submitBootcampRegistration] = useSubmitBootcampRegistrationMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    province: "",
    city: "",
    cnic: "",
  });

  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validationPatterns = {
    name: /^[a-zA-Z\s]{2,50}$/,
    email: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
    whatsapp: /^3\d{9}$/,
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

      case "whatsapp":
        if (!value.trim()) error = "WhatsApp number is required";
        else if (!validationPatterns.whatsapp.test(value))
          error = "Enter 10 digits after +92, e.g. 3001234567";
        break;

      case "province":
        if (!value || value === "") error = "Please select your province";
        break;

      case "city":
        if (!value.trim()) error = "City is required";
        else if (!validationPatterns.city.test(value))
          error = "Please enter a valid city name";
        break;

      case "cnic":
        if (!value.trim()) error = "CNIC is required";
        else if (!validationPatterns.cnic.test(value))
          error = "Format: 00000-0000000-0";
        break;
    }

    return error;
  };

  const clearServerError = (name) => {
    setServerErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      delete newErrors[name === "whatsapp" ? "mbl_number" : name];
      return newErrors;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cnic") {
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
      setErrors((prev) => ({ ...prev, cnic: validateField(name, formatted) }));
      clearServerError(name);
      return;
    }

    if (name === "whatsapp") {
      // Store only the 10 local digits; "+92" is shown as a fixed prefix
      let digits = value.replace(/\D/g, "");
      if (digits.startsWith("92")) digits = digits.slice(2);
      if (digits.startsWith("0")) digits = digits.slice(1);
      digits = digits.slice(0, 10);

      setFormData((prev) => ({ ...prev, whatsapp: digits }));
      setErrors((prev) => ({ ...prev, whatsapp: validateField(name, digits) }));
      clearServerError(name);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    clearServerError(name);
  };

  const handleProvinceChange = (option) => {
    const value =
      typeof option === "object" ? option.value || option.label : option;

    setFormData((prev) => ({ ...prev, province: value }));
    setErrors((prev) => ({
      ...prev,
      province: validateField("province", value),
    }));
    clearServerError("province");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerErrors({});

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
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

    setIsSubmitting(true);

    // Show loading toast
    const loadingToast = toast.loading("Submitting your enrollment...", {
      position: "top-center",
    });

    try {
      const submissionData = {
        name: formData.name,
        email: formData.email,
        mbl_number: `${PHONE_CODE}${formData.whatsapp}`,
        province: formData.province,
        city: formData.city,
        cnic: formData.cnic,
      };

      await submitBootcampRegistration(submissionData).unwrap();

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(
        "Enrollment successful! We'll contact you on WhatsApp within 24 hours.",
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
      province: "",
      city: "",
      cnic: "",
    });
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
                Enrollment Complete!
              </h1>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                Thank you for enrolling in the Bootcamp
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
            Enroll Another Person
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
              Bootcamp Enrollment DawoodTech NextGen Pakistan
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

                  {/* WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      <Phone className="w-4 h-4 mr-2 text-slate-500" />
                      WhatsApp Number *
                    </label>
                    <div className="flex">
                      <div
                        className={`flex items-center px-3 border border-r-0 rounded-l-xl bg-slate-50 dark:bg-slate-700
                          ${
                            errors.whatsapp || serverErrors.whatsapp
                              ? "border-red-300 dark:border-red-700"
                              : "border-slate-300 dark:border-slate-600"
                          }
                        `}
                      >
                        <span className="text-lg mr-2 text-gray-300">🇵🇰</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {PHONE_CODE}
                        </span>
                      </div>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="3001234567"
                        className={`flex-1 px-4 py-3 border rounded-xl rounded-l-none text-slate-900 dark:text-slate-100 focus:outline-none transition-all duration-200
                          ${
                            errors.whatsapp || serverErrors.whatsapp
                              ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900"
                              : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
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

                  {/* Province */}
                  <ProvinceSelect
                    value={formData.province}
                    onChange={handleProvinceChange}
                    error={errors.province || serverErrors.province}
                  />

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

                  {/* CNIC */}
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
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`group px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center
                      ${
                        isSubmitting
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
                    ) : (
                      <span className="flex items-center">
                        Enroll Now
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
                    bootcamp coordination
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

export default BootcampRegistrationForm;
