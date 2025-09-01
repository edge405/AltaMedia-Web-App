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

  // Simplified preset colors - basic, commonly used colors
  const presetColors = [
    "#000000", // Black
    "#FFFFFF", // White
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFA500", // Orange
    "#800080", // Purple
    "#008000", // Dark Green
    "#000080", // Navy
    "#FFC0CB", // Pink
    "#A52A2A", // Brown
    "#808080", // Gray
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
      {/* Display selected colors as simple chips */}
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <div
              key={color}
              className="flex items-center gap-2 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            >
              <div
                className="w-3 h-3 rounded border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-700 dark:text-gray-300">{color}</span>
              <button
                type="button"
                onClick={() => removeColor(color)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Simple color picker interface */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          placeholder={placeholder || "Type color name or hex code"}
          className="flex-1"
        />

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Palette className="w-4 h-4" />
              Colors
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3">
            <div className="space-y-3">
              {/* Simple preset colors grid */}
              <div className="grid grid-cols-5 gap-1">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => addColor(color)}
                    title={color}
                  />
                ))}
              </div>

              {/* Simple color input */}
              <div className="border-t pt-2">
                <Input
                  type="color"
                  onChange={(e) => addColor(e.target.value)}
                  className="w-full h-8"
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