import { useState } from "react";
import { Palette, X, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ColorPicker = ({ value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [colorFormat, setColorFormat] = useState("hex");
  const [rgbValues, setRgbValues] = useState({ r: 0, g: 0, b: 0 });
  const [cmykValues, setCmykValues] = useState({ c: 0, m: 0, y: 0, k: 0 });

  // Handle value as array of colors or single color
  const colors = Array.isArray(value) ? value : (value ? [value] : []);

  // Enhanced preset colors with names
  const presetColors = [
    { hex: "#000000", name: "Black", pantone: "Process Black" },
    { hex: "#FFFFFF", name: "White", pantone: "White" },
    { hex: "#FF0000", name: "Red", pantone: "PMS 185" },
    { hex: "#00FF00", name: "Green", pantone: "PMS 354" },
    { hex: "#0000FF", name: "Blue", pantone: "PMS 286" },
    { hex: "#FFFF00", name: "Yellow", pantone: "PMS 108" },
    { hex: "#FF00FF", name: "Magenta", pantone: "PMS 225" },
    { hex: "#00FFFF", name: "Cyan", pantone: "PMS 306" },
    { hex: "#FFA500", name: "Orange", pantone: "PMS 151" },
    { hex: "#800080", name: "Purple", pantone: "PMS 259" },
    { hex: "#008000", name: "Dark Green", pantone: "PMS 349" },
    { hex: "#000080", name: "Navy", pantone: "PMS 281" },
    { hex: "#FFC0CB", name: "Pink", pantone: "PMS 223" },
    { hex: "#A52A2A", name: "Brown", pantone: "PMS 483" },
    { hex: "#808080", name: "Gray", pantone: "PMS Cool Gray 6" },
  ];

  // Popular Pantone colors
  const pantoneColors = [
    { name: "Classic Blue", pantone: "PMS 19-4052", hex: "#0F4C81" },
    { name: "Living Coral", pantone: "PMS 16-1546", hex: "#FF6F61" },
    { name: "Ultra Violet", pantone: "PMS 18-3838", hex: "#5F4B8B" },
    { name: "Greenery", pantone: "PMS 15-0343", hex: "#88B04B" },
    { name: "Rose Quartz", pantone: "PMS 13-1520", hex: "#F7CAC9" },
    { name: "Serenity", pantone: "PMS 15-3919", hex: "#91A8D0" },
    { name: "Marsala", pantone: "PMS 18-1438", hex: "#955251" },
    { name: "Radiant Orchid", pantone: "PMS 18-3224", hex: "#B565A7" },
    { name: "Emerald", pantone: "PMS 17-5641", hex: "#009B77" },
    { name: "Tangerine Tango", pantone: "PMS 17-1463", hex: "#DD4124" },
  ];

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Convert RGB to hex
  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Convert RGB to CMYK
  const rgbToCmyk = (r, g, b) => {
    r = r / 255;
    g = g / 255;
    b = b / 255;

    const k = 1 - Math.max(r, g, b);
    const c = (1 - r - k) / (1 - k);
    const m = (1 - g - k) / (1 - k);
    const y = (1 - b - k) / (1 - k);

    return {
      c: Math.round(c * 100) || 0,
      m: Math.round(m * 100) || 0,
      y: Math.round(y * 100) || 0,
      k: Math.round(k * 100) || 0
    };
  };

  // Convert CMYK to RGB
  const cmykToRgb = (c, m, y, k) => {
    c = c / 100;
    m = m / 100;
    y = y / 100;
    k = k / 100;

    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);

    return {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b)
    };
  };

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

  const handleColorChange = (newColor) => {
    const rgb = hexToRgb(newColor);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    setRgbValues(rgb);
    setCmykValues(cmyk);
    addColor(newColor);
  };

  const handleRgbChange = (component, value) => {
    const newRgb = { ...rgbValues, [component]: parseInt(value) || 0 };
    setRgbValues(newRgb);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    const cmyk = rgbToCmyk(newRgb.r, newRgb.g, newRgb.b);
    setCmykValues(cmyk);
    addColor(hex);
  };

  const handleCmykChange = (component, value) => {
    const newCmyk = { ...cmykValues, [component]: parseInt(value) || 0 };
    setCmykValues(newCmyk);
    const rgb = cmykToRgb(newCmyk.c, newCmyk.m, newCmyk.y, newCmyk.k);
    setRgbValues(rgb);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    addColor(hex);
  };

  return (
    <div className="space-y-3">
      {/* Display selected colors as enhanced chips */}
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <div
              key={color}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm"
            >
              <div
                className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: color }}
              />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{color}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  RGB({hexToRgb(color).r}, {hexToRgb(color).g}, {hexToRgb(color).b})
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeColor(color)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced color picker interface */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          placeholder={placeholder || "Type color name, hex, RGB, or Pantone"}
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
          <PopoverContent className="w-80 p-4">
            <Tabs defaultValue="presets" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="presets">Presets</TabsTrigger>
                <TabsTrigger value="pantone">Pantone</TabsTrigger>
                <TabsTrigger value="rgb">RGB</TabsTrigger>
                <TabsTrigger value="cmyk">CMYK</TabsTrigger>
              </TabsList>

              <TabsContent value="presets" className="space-y-3">
                <div className="grid grid-cols-5 gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors relative group"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleColorChange(color.hex)}
                      title={`${color.name} - ${color.hex}`}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded" />
                    </button>
                  ))}
                </div>
                <div className="border-t pt-3">
                  <Input
                    type="color"
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-full h-10"
                  />
                </div>
              </TabsContent>

              <TabsContent value="pantone" className="space-y-3">
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {pantoneColors.map((color) => (
                    <button
                      key={color.pantone}
                      type="button"
                      className="flex items-center gap-2 p-2 rounded border border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors text-left"
                      onClick={() => handleColorChange(color.hex)}
                    >
                      <div
                        className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600 flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                          {color.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {color.pantone}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <Input
                  placeholder="Enter Pantone code (e.g., PMS 185)"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleInputKeyPress}
                  className="w-full"
                />
              </TabsContent>

              <TabsContent value="rgb" className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {['r', 'g', 'b'].map((component) => (
                    <div key={component} className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                        {component}
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="255"
                        value={rgbValues[component]}
                        onChange={(e) => handleRgbChange(component, e.target.value)}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 p-2 rounded border border-gray-300 dark:border-gray-600">
                  <div
                    className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: rgbToHex(rgbValues.r, rgbValues.g, rgbValues.b) }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {rgbToHex(rgbValues.r, rgbValues.g, rgbValues.b)}
                  </span>
                </div>
              </TabsContent>

              <TabsContent value="cmyk" className="space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {['c', 'm', 'y', 'k'].map((component) => (
                    <div key={component} className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                        {component}
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={cmykValues[component]}
                        onChange={(e) => handleCmykChange(component, e.target.value)}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 p-2 rounded border border-gray-300 dark:border-gray-600">
                  <div
                    className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: rgbToHex(rgbValues.r, rgbValues.g, rgbValues.b) }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    C:{cmykValues.c}% M:{cmykValues.m}% Y:{cmykValues.y}% K:{cmykValues.k}%
                  </span>
                </div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ColorPicker; 