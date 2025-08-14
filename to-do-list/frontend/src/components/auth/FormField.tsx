import React, { useState, useId, useRef } from "react";
import type { ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormFieldProps {
  type: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  type,
  name,
  label,
  value,
  onChange,
}) => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  const btnClickedRef = useRef(false);

  const focusInput = () => {
    if (!btnClickedRef.current && inputRef.current) {
      inputRef.current.focus();
    }
    btnClickedRef.current = false;
  };

  return (
    <div
      className="relative w-full flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200"
      onClick={focusInput}
    >
      <input
        ref={inputRef}
        id={id}
        name={name}
        type={isPassword && visible ? "text" : type}
        onChange={onChange}
        value={value}
        placeholder=" "
        autoComplete="off"
        required
        className="peer w-full bg-transparent outline-none text-gray-900 placeholder-transparent"
      />
      <label
        htmlFor={id}
        className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent"
      >
        {label}
      </label>

      {isPassword && (
        <button
          type="button"
          className="ml-2 text-gray-500 hover:text-gray-700"
          onClick={() => {
            btnClickedRef.current = true;
            setVisible((prev) => !prev);
          }}
        >
          {visible ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      )}
    </div>
  );
};

export default FormField;
