import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function AdminRevenueChart({ data = [] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 h-96">
      <h3 className="text-lg font-semibold mb-4 text-[#2C2419]">Receita</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="revenue" stroke="#8B7355" fill="#D4A574" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
