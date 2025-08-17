import { useState } from "react";
import { calcPasswordStrength } from "../utils/validators";

function PasswordInput({ label, value, onChange, error, placeholder }) {
  const [show, setShow] = useState(false);
  const strength = calcPasswordStrength(value);
  const bars = 4; // show 4 segments

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && <label className="text-sm font-medium">{label}</label>}
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="text-xs text-neutral-500 hover:underline"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white/50 px-3 py-2 pr-14 outline-none transition focus:ring-2 focus:ring-black/20 dark:bg-neutral-800 dark:focus:ring-white/20 ${error ? "border-red-500" : "border-neutral-200 dark:border-neutral-700"
            }`}
        />
      </div>
      <div className="flex gap-1">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${i < strength ? "bg-green-500" : "bg-neutral-200 dark:bg-neutral-700"}`}
          />
        ))}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
export default PasswordInput;