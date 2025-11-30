import React from 'react';

export default function AdminKPIGrid({ data = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((kpi) => (
        <div key={kpi.id} className="p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">{kpi.label}</div>
          <div className="text-2xl font-bold text-[#2C2419]">{kpi.value}</div>
          {kpi.delta && <div className="text-xs text-gray-400">{kpi.delta}</div>}
        </div>
      ))}
    </div>
  );
}
