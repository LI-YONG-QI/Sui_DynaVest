import React from "react";

interface ButtonProps {
  onClick: () => void;
  text: string;
  icon?: React.ReactNode;
}

const Button = ({ onClick, text, icon }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer max-w-[250px] flex items-center justify-center gap-2.5 rounded-lg bg-[#5F79F1] text-white py-3.5 px-5"
    >
      {icon}
      <span className="text-sm font-semibold">{text}</span>
    </button>
  );
};

export default Button;
