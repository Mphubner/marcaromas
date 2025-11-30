import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag, X, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Meu serviço
import { couponService } from "../services/couponService";

export default function CouponInput({ subtotal, onCouponApplied }) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [error, setError] = useState("");

  const validateMutation = useMutation({
    mutationFn: couponService.validateCoupon,
    onSuccess: (coupon) => {
      const discount = coupon.type === "percentage"
        ? (subtotal * coupon.amount) / 100
        : Math.min(coupon.amount, subtotal);

      setAppliedCoupon(coupon);
      onCouponApplied({ ...coupon, discount });
      setError("");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Cupom inválido.");
    }
  });

  const handleApply = () => {
    if (!couponCode.trim()) return;
    validateMutation.mutate(couponCode);
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    onCouponApplied(null);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {appliedCoupon && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-green-900">{appliedCoupon.code}</p>
                <p className="text-sm text-green-700">Cupom aplicado!</p>
              </div>
              <Button onClick={handleRemove} variant="ghost" size="icon"><X className="w-5 h-5" /></Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!appliedCoupon && (
        <div>
          <div className="flex gap-2">
            <Input placeholder="Código do cupom" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />
            <Button onClick={handleApply} disabled={validateMutation.isPending} variant="outline">
              {validateMutation.isPending ? "..." : "Aplicar"}
            </Button>
          </div>
          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-red-600 mt-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
