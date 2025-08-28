import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

const CheckboxGroup = ({
  options,
  value = [],
  onChange,
  className = ""
}) => {
  // Ensure value is always an array
  const safeValue = (() => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        // If it's not valid JSON, treat it as a single item
        return value.trim() ? [value] : [];
      }
    }
    return [];
  })();

  const [selectedValues, setSelectedValues] = useState(safeValue);

  useEffect(() => {
    setSelectedValues(safeValue);
  }, [safeValue]);

  const handleToggle = (option) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];

    setSelectedValues(newValues);
    onChange(newValues);
  };

  const handleSelectAll = () => {
    setSelectedValues(options);
    onChange(options);
  };

  const handleClearAll = () => {
    setSelectedValues([]);
    onChange([]);
  };

  const isAllSelected = selectedValues.length === options.length;
  const isSomeSelected = selectedValues.length > 0;

  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      {/* Select All / Clear All buttons */}
      <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          disabled={isAllSelected}
          className="flex items-center gap-2 text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full sm:w-auto"
        >
          <Check className="w-3 h-3" />
          Select All
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClearAll}
          disabled={!isSomeSelected}
          className="flex items-center gap-2 text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full sm:w-auto"
        >
          <X className="w-3 h-3" />
          Clear All
        </Button>
      </div>

      {/* Checkboxes in responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-h-48 sm:max-h-64 overflow-y-auto form-scroll">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2 sm:space-x-3">
            <Checkbox
              id={`checkbox-${option}`}
              checked={selectedValues.includes(option)}
              onCheckedChange={() => handleToggle(option)}
              className="border-gray-300 dark:border-gray-600"
            />
            <Label
              htmlFor={`checkbox-${option}`}
              className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 cursor-pointer leading-tight"
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup; 