import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PasswordInputProps {
  field: any; // Adjust typing based on your useForm field type
  placeholder?: string;
  readOnly?: boolean
}

export function PasswordInput({ field, placeholder, readOnly }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder || "Enter password"}
        readOnly={readOnly || false}
        {...field}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5 text-gray-500" />
        ) : (
          <Eye className="h-5 w-5 text-gray-500" />
        )}
      </button>
    </div>
  );
}
