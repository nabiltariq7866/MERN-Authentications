import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Input from "./Input";
import { Loader2 } from "lucide-react"; // 🔥 Spinner icon

function OTPModal({ isOpen, onClose, onVerify, loading }) {
  const [channel, setChannel] = useState("email");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!isOpen) setOtp("");
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify({ channel, otp }); // ✅ Fix: pass both channel & otp
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Verify your account</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Choose verification method and enter the 6-digit code.
              </p>
            </div>

            {/* Verification method toggle */}
            <div className="mb-3 flex gap-2">
              {[
                { key: "email", label: "Email" },
                { key: "sms", label: "SMS" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setChannel(opt.key)}
                  className={`rounded-full px-3 py-1 text-sm transition ${channel === opt.key
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-neutral-100 dark:bg-neutral-800"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* OTP form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="OTP Code"
                placeholder="e.g. 123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 rounded-xl border border-neutral-200 px-4 py-2 text-sm dark:border-neutral-700"
                >
                  Cancel
                </button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-black text-white font-semibold rounded-xl shadow-md"
                >
                  {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                  {loading ? "Verifying..." : "Verify OTP"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OTPModal;
