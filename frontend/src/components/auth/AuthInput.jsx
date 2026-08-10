const AuthInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="
          h-11 w-full rounded-lg
          border border-slate-200
          bg-white px-3.5
          text-sm text-slate-900
          outline-none
          transition
          placeholder:text-slate-400
          focus:border-[#0078BD]
          focus:ring-4
          focus:ring-[#0078BD]/10
        "
      />
    </div>
  );
};

export default AuthInput;