import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FormField = ({
  label,
  type,
  description,
  required,
  askAI,
  aiSuggestions,
  children
}) => {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <label className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex items-center gap-2">
          {type && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 sm:px-3 py-1 rounded-full font-medium">
              {type}
            </span>
          )}
          {askAI && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => {
                      // Call your ask-ai edge function here
                      // You can implement the actual edge function call here
                    }}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900"
                  >
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ask AI for help with this field</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {aiSuggestions && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 sm:px-3 py-1 rounded-full font-medium flex items-center gap-1">
              ✨ AI Suggestions
            </span>
          )}
        </div>
      </div>
      {description && <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed">{description}</p>}
      <div className="mb-2">
        {children}
      </div>
    </div>
  );
};

export default FormField; 