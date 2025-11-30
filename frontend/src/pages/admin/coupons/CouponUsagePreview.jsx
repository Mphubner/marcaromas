import React from "react";
export default function CouponUsagePreview({ coupons }) {
  // Dummy usage data
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          <th className="p-2 text-left">Código</th>
          <th className="p-2 text-left">Usos</th>
          <th className="p-2 text-left">Último Pedido</th>
        </tr>
      </thead>
      <tbody>
        {coupons.map(c => (
          <tr key={c.id} className="border-b">
            <td className="p-2">{c.code}</td>
            <td className="p-2">{c.usage_count || Math.floor(Math.random() * 20)}</td>
            <td className="p-2">{c.lastOrderId || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
