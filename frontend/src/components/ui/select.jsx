import React from "react";

export default function Select({ label, options = [], ...props }) {
  return (
    <label className="block mb-3">
      {label && (
        <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </span>
      )}
      <select
        {...props}
        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 text-gray-800 dark:text-gray-100"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
