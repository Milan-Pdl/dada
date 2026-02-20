import { InputHTMLAttributes, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, hint, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-ink-500 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3.5 py-2.5 bg-white border border-ink-100 rounded-xl text-sm text-ink-900
            placeholder:text-ink-300
            focus:border-accent focus:ring-2 focus:ring-accent/10 focus:outline-none
            transition-all duration-150
            ${error ? "border-danger focus:border-danger focus:ring-danger/10" : ""}
            ${className}
          `}
          {...props}
        />
        {hint && !error && <p className="text-xs text-ink-400">{hint}</p>}
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
