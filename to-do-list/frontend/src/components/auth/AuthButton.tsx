// components/AuthButton.tsx
import React from "react";

interface AuthButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

const AuthButton: React.FC<AuthButtonProps> = ({ text, onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="flex items-center justify-center w-full m-2 px-4 py-2 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-medium shadow-md transition-colors"
    >
      {text}
    </button>
  );
};

export default AuthButton;
