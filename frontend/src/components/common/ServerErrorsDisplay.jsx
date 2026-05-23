import React from "react";
import { AlertCircle } from "lucide-react";

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

export default ServerErrorsDisplay;