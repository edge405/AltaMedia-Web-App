import { useState, useEffect, useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, Plus } from 'lucide-react';

// Utility function to load Google Fonts
const loadGoogleFont = (fontName) => {
  // Clean the font name for Google Fonts API
  const cleanFontName = fontName.replace(/\s+/g, '+');

  // Check if font is already loaded
  const existingLink = document.querySelector(`link[href*="${cleanFontName}"]`);
  if (existingLink) {
    return Promise.resolve();
  }

  // Load the font from Google Fonts
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${cleanFontName}:wght@400;500;600&display=swap`;
    link.rel = 'stylesheet';
    link.onload = () => resolve();
    link.onerror = () => resolve(); // Continue even if font fails to load
    document.head.appendChild(link);
  });
};

const CheckboxGroup = ({
  options,
  value = [],
  onChange,
  className = "",
  enableCustomInput = false,
  customInputPlaceholder = "Add custom option...",
  fontBasedStyling = false
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
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customOptions, setCustomOptions] = useState([]);

  // Combine original options with custom options
  const allOptions = [...options, ...customOptions];

  // Update internal state when props change
  useEffect(() => {
    console.log('CheckboxGroup: safeValue changed to:', safeValue);
    setSelectedValues(safeValue);
  }, [safeValue]);

  // Extract custom options from the current value
  useEffect(() => {
    const customOpts = safeValue.filter(val => !options.includes(val));
    console.log('CheckboxGroup: Extracted custom options:', customOpts);
    setCustomOptions(customOpts);
  }, [safeValue, options]);

  const handleChange = useCallback((newValues) => {
    console.log('CheckboxGroup: handleChange called with:', newValues);
    if (onChange) {
      onChange(newValues);
    }
  }, [onChange]);

  const handleToggle = (option) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];

    console.log('CheckboxGroup: Toggle option:', option, 'New values:', newValues);
    setSelectedValues(newValues);
    handleChange(newValues);
  };

  const handleSelectAll = () => {
    console.log('CheckboxGroup: Select all options:', allOptions);
    setSelectedValues(allOptions);
    handleChange(allOptions);
  };

  const handleClearAll = () => {
    console.log('CheckboxGroup: Clear all options');
    setSelectedValues([]);
    handleChange([]);
  };

  const handleAddCustomOption = () => {
    const trimmedInput = customInput.trim();

    if (trimmedInput && !allOptions.includes(trimmedInput)) {
      const newOption = trimmedInput;
      const newCustomOptions = [...customOptions, newOption];
      const newValues = [...selectedValues, newOption];

      console.log('CheckboxGroup: Adding custom option:', newOption);
      console.log('CheckboxGroup: New custom options:', newCustomOptions);
      console.log('CheckboxGroup: New selected values:', newValues);

      // Try to load the font if it's a Google Font
      if (fontBasedStyling) {
        loadGoogleFont(newOption).then(() => {
          console.log('CheckboxGroup: Font loaded for:', newOption);
        });
      }

      // Update custom options
      setCustomOptions(newCustomOptions);

      // Update selected values
      setSelectedValues(newValues);

      // Clear input and hide form
      setCustomInput('');
      setShowCustomInput(false);

      // Notify parent component
      handleChange(newValues);
    } else {
      console.log('CheckboxGroup: Cannot add custom option - already exists or empty:', trimmedInput);
    }
  };

  const handleRemoveCustomOption = (option) => {
    console.log('CheckboxGroup: Removing custom option:', option);

    const newCustomOptions = customOptions.filter(opt => opt !== option);
    const newValues = selectedValues.filter(v => v !== option);

    console.log('CheckboxGroup: New custom options after removal:', newCustomOptions);
    console.log('CheckboxGroup: New selected values after removal:', newValues);

    setCustomOptions(newCustomOptions);
    setSelectedValues(newValues);
    handleChange(newValues);
  };

  const getFontFamily = (option) => {
    if (!fontBasedStyling) return '';

    // Standard font mappings
    const fontMap = {
      'Serif': 'serif',
      'Sans-serif': 'sans-serif',
      'Script': 'cursive',
      'Display': 'fantasy',
      'Monospace': 'monospace'
    };

    // Check if it's a standard font first
    if (fontMap[option]) {
      return fontMap[option];
    }

    // For custom fonts, apply the font directly
    if (customOptions.includes(option)) {
      return option;
    }

    return '';
  };

  const isAllSelected = selectedValues.length === allOptions.length && allOptions.length > 0;
  const isSomeSelected = selectedValues.length > 0;

  console.log('CheckboxGroup render - allOptions:', allOptions);
  console.log('CheckboxGroup render - selectedValues:', selectedValues);
  console.log('CheckboxGroup render - customOptions:', customOptions);

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
        {allOptions.map((option) => {
          const isChecked = selectedValues.includes(option);
          const isCustomOption = customOptions.includes(option);

          return (
            <div key={option} className="flex items-center space-x-2 sm:space-x-3 group">
              <Checkbox
                id={`checkbox-${option}`}
                checked={isChecked}
                onCheckedChange={() => handleToggle(option)}
                className="border-gray-300 dark:border-gray-600"
              />
              <Label
                htmlFor={`checkbox-${option}`}
                className={`text-xs sm:text-sm cursor-pointer leading-tight flex-1 ${isCustomOption
                  ? 'text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300'
                  }`}
                style={{ fontFamily: getFontFamily(option) }}
              >
                {option}
                {isCustomOption}
                {isChecked}
              </Label>
              {enableCustomInput && isCustomOption && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCustomOption(option)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Input Section */}
      {enableCustomInput && (
        <div className="mt-4 space-y-2">
          {!showCustomInput ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCustomInput(true)}
              className="flex items-center gap-2 text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Plus className="w-3 h-3" />
              Add Custom Option
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={customInputPlaceholder}
                className="flex-1 text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomOption();
                  }
                }}
                autoFocus
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCustomOption}
                disabled={!customInput.trim()}
                className="text-xs"
              >
                Add
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomInput('');
                }}
                className="text-xs"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckboxGroup; 