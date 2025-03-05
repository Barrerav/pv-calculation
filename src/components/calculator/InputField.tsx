
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface InputFieldProps {
  id: string;
  label: React.ReactNode; // Changed from string to ReactNode to allow JSX elements
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  min?: number;
  max?: number;
  step?: string;
  required?: boolean;
  unit?: string;
}

const InputField = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "number", 
  min, 
  max, 
  step = "0.01", 
  required = false,
  unit
}: InputFieldProps) => {
  return (
    <div className="space-y-2 mb-4">
      <Label htmlFor={id} className="text-asme-blue font-medium">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          required={required}
          className="form-input pr-12"
        />
        {unit && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            {unit}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
