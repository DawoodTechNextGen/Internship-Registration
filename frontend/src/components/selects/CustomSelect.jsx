import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { ChevronDown, Search, CheckCircle, Loader2 } from "lucide-react";

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
  const dropdownRef = useRef(null);

  const getOptionText = useCallback((option) => {
    if (!option) return "";
    if (typeof option === "string") return option;
    return option.name || option.label || String(option);
  }, []);

  const getOptionDisabled = useCallback((option) => {
    if (!option) return false;
    if (typeof option === "object") return option.disabled || false;
    return false;
  }, []);

  const getOptionValue = useCallback((option) => {
    if (!option) return null;
    if (typeof option === "string") return option;
    return option.value || option.id || option;
  }, []);

  const isOptionSelected = useCallback(
    (option) => {
      if (!value) return false;
      const optionValue = getOptionValue(option);
      const currentValue =
        typeof value === "object" ? getOptionValue(value) : value;
      return optionValue === currentValue;
    },
    [value, getOptionValue],
  );

  const filteredOptions = useMemo(() => {
    const safeOptions = Array.isArray(options) ? options : [];
    if (searchable && searchTerm) {
      const filtered = safeOptions.filter((option) => {
        const optionText = getOptionText(option);
        return optionText.toLowerCase().includes(searchTerm.toLowerCase());
      });
      return filtered;
    } else {
      return safeOptions;
    }
  }, [searchTerm, options, searchable, getOptionText]);

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

  const getSelectedOption = () => {
    if (!value) return null;

    const safeOptions = Array.isArray(options) ? options : [];
    // If value is a string, find matching option
    if (typeof value === "string") {
      return safeOptions.find((option) => getOptionValue(option) === value);
    }

    // If value is an object, check if it exists in options
    const valueKey = getOptionValue(value);
    return (
      safeOptions.find((option) => getOptionValue(option) === valueKey) || value
    );
  };

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
        {Icon && <Icon className="w-3.5 h-3.5 text-blue-400" />}
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !loading && setIsOpen(!isOpen)}
          disabled={loading}
          className={`w-full px-4 py-3 bg-slate-800/60 border rounded-xl text-left flex items-center justify-between transition-colors duration-200
            ${
              error
                ? "border-red-500/60 focus:border-red-500"
                : "border-slate-700 hover:border-slate-600 focus:border-blue-500"
            }
            ${isOpen ? "ring-2 ring-blue-500/20 border-blue-500" : ""}
            ${loading ? "opacity-70 cursor-not-allowed" : ""}
          `}
        >
          <div className="flex items-center min-w-0 flex-1">
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin mr-3" />
                <span className="text-slate-500">Loading...</span>
              </div>
            ) : value ? (
              renderSelected ? (
                renderSelected(getSelectedOption())
              ) : (
                <div className="font-medium text-white truncate">
                  {getOptionText(getSelectedOption()) || getOptionText(value)}
                </div>
              )
            ) : (
              <span className="text-slate-500">{placeholder}</span>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? "rotate-180" : ""
            } ${loading ? "opacity-50" : ""}`}
          />
        </button>

        {isOpen && !loading && (
          <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl shadow-slate-950/50 max-h-80 overflow-hidden animate-slideDown">
            {searchable && (
              <div className="p-3 border-b border-slate-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-900/60 text-white placeholder-slate-500"
                    autoFocus
                  />
                </div>
              </div>
            )}

            <div className="overflow-y-auto max-h-40 custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-center text-slate-500">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const selected = isOptionSelected(option);
                  const disabled = getOptionDisabled(option);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => !disabled && handleSelect(option)}
                      disabled={disabled}
                      className={`w-full px-4 py-3 text-left transition-colors duration-150 flex items-center
                        ${
                          disabled
                            ? "text-slate-600 cursor-not-allowed bg-slate-800/30"
                            : "hover:bg-slate-700/50"
                        }
                        ${selected ? "bg-blue-500/10" : ""}
                      `}
                    >
                      {renderOption ? (
                        renderOption(option, selected)
                      ) : (
                        <>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate">
                              {getOptionText(option)}
                            </div>
                          </div>
                          {selected && (
                            <CheckCircle className="w-5 h-5 text-blue-400 ml-2 flex-shrink-0" />
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
        <p className="text-red-400 text-xs mt-1 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomSelect;
