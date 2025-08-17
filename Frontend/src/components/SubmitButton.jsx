import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

function SubmitButton({ loading, children }) {
  return (
    <motion.button
      type="submit"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      disabled={loading}
      className="inline-flex w-full items-center justify-center rounded-xl bg-black px-4 py-2 text-white shadow disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black cursor-pointer"
    >
      {loading ? (
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="flex items-center gap-2 text-sm"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </motion.span>
      ) : (
        children
      )}
    </motion.button>
  );
}

export default SubmitButton;
