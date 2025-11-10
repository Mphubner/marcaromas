import React from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") || "light"
  );

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <motion.button
      whileTap={{ rotate: 15 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
      aria-label="Alternar tema"
    >
      {theme === "dark" ? (
        <Sun className="text-yellow-400" size={20} />
      ) : (
        <Moon className="text-gray-700" size={20} />
      )}
    </motion.button>
  );
}
