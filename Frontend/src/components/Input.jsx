import { useMemo } from "react";

function Input({ label, type = "text", value, onChange, error, placeholder, ...rest }) {
  const id = useMemo(() => Math.random().toString(36).slice(2), []);
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-white/50 px-3 py-2 outline-none transition focus:ring-2 focus:ring-black/20 dark:bg-neutral-800 dark:focus:ring-white/20 ${error ? "border-red-500" : "border-neutral-200 dark:border-neutral-700"
          }`}
        {...rest}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
export default Input;