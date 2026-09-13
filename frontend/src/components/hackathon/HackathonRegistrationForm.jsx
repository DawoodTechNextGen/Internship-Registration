import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Users,
  UserPlus,
  Plus,
  Trash2,
  ArrowRight,
  Shield,
  Loader2,
  CheckCircle,
  Terminal,
} from "lucide-react";
import { useSubmitHackathonRegistrationMutation } from "../../api/apiSlice.js";
import useTechnologies from "../../hooks/useTechnologies";
import TechnologySelect from "../selects/TechnologySelect";
import ServerErrorsDisplay from "../common/ServerErrorsDisplay";

const PHONE_CODE = "+92";

const emptyMember = () => ({ name: "", email: "" });

const TechField = ({ label, icon: Icon, error, className = "", ...inputProps }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
      {Icon && <Icon className="w-3.5 h-3.5 text-blue-400" />}
      {label}
    </label>
    <input
      {...inputProps}
      className={`w-full px-4 py-3 bg-slate-800/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none transition-colors duration-200 ${
        error
          ? "border-red-500/60 focus:border-red-500"
          : "border-slate-700 hover:border-slate-600 focus:border-blue-500"
      } ${className}`}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const HackathonRegistrationForm = ({ hackathon }) => {
  const { technologies, loading: techLoading, error: techApiError, retryFetch } = useTechnologies();
  const [submitHackathonRegistration] = useSubmitHackathonRegistrationMutation();

  const canIndividual = !!hackathon.allow_individual;
  const canTeam = !!hackathon.allow_team;
  const minTeamSize = hackathon.min_team_size || 1;
  const maxTeamSize = hackathon.max_team_size || 4;
  const minMembers = Math.max(0, minTeamSize - 1);
  const maxMembers = Math.max(0, maxTeamSize - 1);

  const [registrationType, setRegistrationType] = useState(canIndividual ? "individual" : "team");
  const [members, setMembers] = useState(
    registrationType === "team" ? Array.from({ length: minMembers }, emptyMember) : [],
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    city: "",
    teamName: "",
    technology: "",
    projectIdea: "",
  });

  const [errors, setErrors] = useState({});
  const [memberErrors, setMemberErrors] = useState([]);
  const [serverErrors, setServerErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validationPatterns = {
    name: /^[a-zA-Z\s]{2,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    whatsapp: /^3\d{9}$/,
    city: /^[a-zA-Z\s]{2,30}$/,
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (!validationPatterns.name.test(value)) error = "Name must be 2-50 characters, letters only";
        break;

      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!validationPatterns.email.test(value)) error = "Please enter a valid email address";
        break;

      case "whatsapp":
        if (!value.trim()) error = "WhatsApp number is required";
        else if (!validationPatterns.whatsapp.test(value)) error = "Enter 10 digits after +92, e.g. 3001234567";
        break;

      case "city":
        if (!value.trim()) error = "City is required";
        else if (!validationPatterns.city.test(value)) error = "Please enter a valid city name";
        break;

      case "teamName":
        if (!value.trim()) error = "Team name is required";
        else if (value.trim().length > 100) error = "Team name is too long";
        break;
    }

    return error;
  };

  const clearServerError = (name) => {
    setServerErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      delete newErrors[name === "whatsapp" ? "mbl_number" : name];
      delete newErrors[name === "teamName" ? "team_name" : name];
      return newErrors;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "whatsapp") {
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
    if (["name", "email", "city", "teamName"].includes(name)) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
    clearServerError(name);
  };

  const handleTechChange = (option) => {
    if (option && typeof option === "object") {
      setFormData((prev) => ({ ...prev, technology: option.id }));
      clearServerError("technology_id");
    }
  };

  const handleRegistrationTypeChange = (type) => {
    setRegistrationType(type);
    if (type === "team" && members.length < minMembers) {
      setMembers(Array.from({ length: minMembers }, emptyMember));
    }
    if (type === "individual") {
      setMemberErrors([]);
    }
    setServerErrors({});
  };

  const handleMemberChange = (index, field, value) => {
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
    setMemberErrors((prev) => {
      const next = [...prev];
      if (next[index]) next[index] = { ...next[index], [field]: "" };
      return next;
    });
  };

  const addMember = () => {
    if (members.length >= maxMembers) return;
    setMembers((prev) => [...prev, emptyMember()]);
  };

  const removeMember = (index) => {
    if (members.length <= minMembers) return;
    setMembers((prev) => prev.filter((_, i) => i !== index));
    setMemberErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const validateMembers = () => {
    const seenEmails = new Set([formData.email.trim().toLowerCase()]);
    const nextErrors = members.map((member) => {
      const rowErrors = {};
      if (!member.name.trim() || !validationPatterns.name.test(member.name))
        rowErrors.name = "Name must be 2-50 characters, letters only";
      if (!member.email.trim() || !validationPatterns.email.test(member.email)) {
        rowErrors.email = "Please enter a valid email address";
      } else if (seenEmails.has(member.email.trim().toLowerCase())) {
        rowErrors.email = "Each team member must have a unique email";
      } else {
        seenEmails.add(member.email.trim().toLowerCase());
      }
      return rowErrors;
    });
    setMemberErrors(nextErrors);
    return nextErrors.every((row) => Object.keys(row).length === 0);
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      duration: 4000,
      position: "top-center",
      style: { background: "#ef4444", color: "white" },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErrors({});

    const fieldsToValidate = ["name", "email", "whatsapp", "city"];
    if (registrationType === "team") fieldsToValidate.push("teamName");

    const newErrors = {};
    fieldsToValidate.forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    const membersValid = registrationType === "team" ? validateMembers() : true;

    if (Object.keys(newErrors).length > 0 || !membersValid) {
      setErrors(newErrors);
      showErrorToast("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting your registration...", { position: "top-center" });

    try {
      const submissionData = {
        hackathon_id: hackathon.id,
        registration_type: registrationType,
        name: formData.name,
        email: formData.email,
        mbl_number: `${PHONE_CODE}${formData.whatsapp}`,
        city: formData.city,
        technology_id: formData.technology || null,
        project_idea: formData.projectIdea || null,
      };

      if (registrationType === "team") {
        submissionData.team_name = formData.teamName;
        submissionData.members = members.map((m) => ({ name: m.name, email: m.email }));
      }

      await submitHackathonRegistration(submissionData).unwrap();

      toast.dismiss(loadingToast);
      toast.success("Registration successful! We'll be in touch on WhatsApp soon.", {
        duration: 5000,
        position: "top-center",
        style: { background: "#10b981", color: "white" },
        icon: "🎉",
      });

      setIsSubmitted(true);
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Hackathon submission error:", err);

      if (err && err.status && typeof err.status === "number") {
        const { status, data } = err;

        if (status === 422 && data.errors) {
          const mapped = {};
          Object.keys(data.errors).forEach((field) => {
            const formField = field === "mbl_number" ? "whatsapp" : field === "team_name" ? "teamName" : field;
            mapped[formField] = Array.isArray(data.errors[field]) ? data.errors[field].join(", ") : data.errors[field];
          });
          setServerErrors(mapped);
          showErrorToast(data.message || "Please fix the errors below and try again.");
        } else if (status === 400) {
          showErrorToast(data.message || "Bad request. Please check your input.");
        } else if (status === 404) {
          showErrorToast(data.message || "This hackathon could not be found.");
        } else {
          showErrorToast(data.message || "Submission failed. Please try again.");
        }
      } else if (err && err.status === "FETCH_ERROR") {
        showErrorToast("Network error. Please check your connection and try again.");
      } else {
        showErrorToast("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="relative flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              You're Registered!
            </h1>
            <p className="text-slate-400 leading-relaxed">
              Thanks for registering for {hackathon.title}. We'll contact you on WhatsApp with next steps.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { background: "#363636", color: "#fff" },
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8 max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-blue-400 mb-3">
            <Terminal className="w-3.5 h-3.5" />
            registration.init()
          </div>
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Register for {hackathon.title}
          </h1>
        </div>

        <div className="rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-2xl shadow-blue-500/5 overflow-hidden">
          <div className="p-8">
            <ServerErrorsDisplay errors={serverErrors} />

            {canIndividual && canTeam && (
              <div className="flex gap-2 mb-6 p-1 bg-slate-800/60 border border-slate-700/50 rounded-xl w-full max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={() => handleRegistrationTypeChange("individual")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    registrationType === "individual"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <User className="w-4 h-4" />
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => handleRegistrationTypeChange("team")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    registrationType === "team"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Team
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {registrationType === "team" && (
                <TechField
                  label="Team Name *"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  placeholder="Enter your team name"
                  icon={Users}
                  error={errors.teamName || serverErrors.teamName}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TechField
                  label={registrationType === "team" ? "Team Leader Name *" : "Your Name *"}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  icon={User}
                  error={errors.name || serverErrors.name}
                />

                <TechField
                  label={registrationType === "team" ? "Team Leader Email *" : "Your Email *"}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  icon={Mail}
                  error={errors.email || serverErrors.email}
                />

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    WhatsApp Number *
                  </label>
                  <div className="flex">
                    <div
                      className={`flex items-center px-3 border border-r-0 rounded-l-xl bg-slate-800/80
                        ${
                          errors.whatsapp || serverErrors.whatsapp ? "border-red-500/60" : "border-slate-700"
                        }
                      `}
                    >
                      <span className="text-lg mr-2">🇵🇰</span>
                      <span className="font-medium text-slate-300">{PHONE_CODE}</span>
                    </div>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="3001234567"
                      className={`flex-1 px-4 py-3 border rounded-xl rounded-l-none bg-slate-800/60 text-white placeholder-slate-500 focus:outline-none transition-colors duration-200
                        ${
                          errors.whatsapp || serverErrors.whatsapp
                            ? "border-red-500/60 focus:border-red-500"
                            : "border-slate-700 hover:border-slate-600 focus:border-blue-500"
                        }
                      `}
                    />
                  </div>
                  {(errors.whatsapp || serverErrors.whatsapp) && (
                    <p className="text-red-400 text-xs mt-1 animate-fadeIn">
                      {errors.whatsapp || serverErrors.whatsapp}
                    </p>
                  )}
                </div>

                <TechField
                  label="City *"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  icon={MapPin}
                  error={errors.city || serverErrors.city}
                />

                <TechnologySelect
                  value={formData.technology}
                  onChange={handleTechChange}
                  error={serverErrors.technology_id}
                  technologies={technologies}
                  loading={techLoading}
                  onRetry={retryFetch}
                  apiError={techApiError}
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  Project Idea (optional)
                </label>
                <textarea
                  name="projectIdea"
                  value={formData.projectIdea}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Briefly describe what you plan to build..."
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 hover:border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                />
              </div>

              {registrationType === "team" && (
                <div className="space-y-4 pt-2 border-t border-slate-700/60">
                  <div className="flex items-center justify-between pt-4">
                    <h3 className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
                      <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                      Team Members ({members.length + 1}/{maxTeamSize})
                    </h3>
                    <button
                      type="button"
                      onClick={addMember}
                      disabled={members.length >= maxMembers}
                      className={`inline-flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        members.length >= maxMembers
                          ? "text-slate-600 cursor-not-allowed"
                          : "text-blue-400 hover:bg-blue-500/10"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      Add Member
                    </button>
                  </div>

                  {members.map((member, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-start bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl"
                    >
                      <TechField
                        label={`Member ${index + 1} Name`}
                        name={`member-${index}-name`}
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                        placeholder="Name"
                        error={memberErrors[index]?.name}
                      />
                      <TechField
                        label={`Member ${index + 1} Email`}
                        name={`member-${index}-email`}
                        type="email"
                        value={member.email}
                        onChange={(e) => handleMemberChange(index, "email", e.target.value)}
                        placeholder="email@example.com"
                        error={memberErrors[index]?.email}
                      />
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        disabled={members.length <= minMembers}
                        className={`mt-7 p-3 rounded-xl transition-colors ${
                          members.length <= minMembers
                            ? "text-slate-700 cursor-not-allowed"
                            : "text-red-400 hover:bg-red-500/10"
                        }`}
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <p className="text-xs text-slate-500 font-mono">
                    Team size must be between {minTeamSize} and {maxTeamSize} members (including you).
                  </p>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`group w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center
                    ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:from-blue-700 hover:to-blue-800 hover:scale-[1.02] cursor-pointer"}
                  `}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Register Now
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center pt-4 border-t border-slate-700/60">
                <Shield className="w-4 h-4 text-blue-400 mr-2" />
                <p className="text-xs text-slate-500 font-mono">
                  Your information is secure and will only be used for hackathon coordination
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default HackathonRegistrationForm;
