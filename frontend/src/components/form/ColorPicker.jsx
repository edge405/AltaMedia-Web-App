import { useState } from "react";
import { Palette, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const ColorPicker = ({ value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  // Handle value as array of colors or single color
  const colors = Array.isArray(value) ? value : (value ? [value] : []);
  
  const presetColors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
    "#F8C471", "#82E0AA", "#F1948A", "#85C1E9", "#D7BDE2"
  ];

  const addColor = (color) => {
    if (!colors.includes(color)) {
      const newColors = [...colors, color];
      onChange(newColors);
    }
    setInputValue("");
    setIsOpen(false);
  };

  const removeColor = (colorToRemove) => {
    const newColors = colors.filter(color => color !== colorToRemove);
    onChange(newColors);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addColor(inputValue.trim());
    }
  };

  return (
    <div className="space-y-3">
      {/* Display selected colors as tags */}
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto form-scroll">
          {colors.map((color) => (
            <div
              key={color}
              className="flex items-center gap-2 px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            >
              <div
                className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{color}</span>
              <button
                type="button"
                onClick={() => removeColor(color)}
                className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Color input and picker */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          placeholder={placeholder || "Enter hex color (e.g., #FF6B6B) or press Enter"}
          className="flex-1"
        />
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Palette className="w-4 h-4" />
              Pick
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-8 h-8 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => addColor(color)}
                  />
                ))}
              </div>
              <div className="border-t pt-3">
                <Input
                  type="color"
                  onChange={(e) => addColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ColorPicker; 