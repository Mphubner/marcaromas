import React from "react";
import { motion } from "framer-motion";
import { Leaf, Heart } from "lucide-react";

export default function SobrePage() {
  return (
    <motion.section
      className="max-w-5xl mx-auto px-4 mt-24"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold mb-4">Sobre a Marc Aromas</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        A Marc Aromas nasceu da paixão por transformar ambientes através de fragrâncias únicas e experiências sensoriais.
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="flex flex-col items-center text-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
          <Leaf className="text-brand-primary mb-2" size={28} />
          <h3 className="font-semibold mb-1">Sustentabilidade</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Utilizamos cera vegetal e embalagens recicláveis.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
          <Heart className="text-brand-primary mb-2" size={28} />
          <h3 className="font-semibold mb-1">Feitas com amor</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cada vela é moldada manualmente com cuidado e intenção.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
