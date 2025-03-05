
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectFieldProps {
  id: string;
  label: React.ReactNode; // Changed from string to ReactNode to allow JSX elements
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

const SelectField = ({ id, label, value, onChange, options, required = false }: SelectFieldProps) => {
  return (
    <div className="space-y-2 mb-4">
      <Label htmlFor={id} className="text-asme-blue font-medium">{label}</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        required={required}
      >
        <SelectTrigger id={id} className="form-input">
          <SelectValue placeholder="Seleccione..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectField;
