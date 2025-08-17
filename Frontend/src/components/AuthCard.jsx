import { motion } from "framer-motion";

function AuthCard({ title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md rounded-2xl bg-white/70 p-6 shadow-xl backdrop-blur-md dark:bg-neutral-900/70"
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}
export default AuthCard;