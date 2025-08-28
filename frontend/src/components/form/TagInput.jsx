import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TagInput = ({ value, onChange, placeholder, suggestions = [] }) => {
  const [inputValue, setInputValue] = useState("");

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

  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !safeValue.includes(trimmedTag)) {
      onChange([...safeValue, trimmedTag]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(safeValue.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex gap-2 sm:gap-3">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Type and press Enter to add tags"}
          className="flex-1 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 dark:bg-gray-700 dark:text-gray-200 text-sm sm:text-base"
        />
        <Button
          type="button"
          onClick={() => addTag(inputValue)}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 px-3 sm:px-4"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {safeValue.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {safeValue.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 sm:gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 tag-hover"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-500 dark:hover:text-red-400 transition-colors p-0.5 sm:p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">💡 Suggestions:</p>
          <div className="flex flex-wrap gap-1 sm:gap-2 max-h-24 sm:max-h-32 overflow-y-auto form-scroll">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addTag(suggestion)}
                className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-200 px-2 sm:px-3 py-1 sm:py-2 rounded-full transition-all duration-200 transform hover:scale-105 font-medium"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagInput; 