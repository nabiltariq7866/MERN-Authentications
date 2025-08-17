import { motion } from "framer-motion";

function Dashboard() {
  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900"
    >
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <p className="mt-2 text-neutral-500 dark:text-neutral-400">You're logged in. Replace this with your app content.</p>
    </motion.div>
  );
}
export default Dashboard;