import React from "react";

export default function Textarea({ label, ...props }) {
  return (
    <label className="block mb-3">
      {label && (
        <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </span>
      )}
      <textarea
        {...props}
        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
      />
    </label>
  );
}
