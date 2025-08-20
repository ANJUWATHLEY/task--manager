import React from "react";

const Input = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

export { Input };
