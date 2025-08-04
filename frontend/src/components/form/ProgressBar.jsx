import { Check } from "lucide-react";

const ProgressBar = ({ currentStep, totalSteps, steps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-6 sm:mb-8">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex-1 mr-3 sm:mr-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 shadow-inner">
            <div 
              className="bg-blue-600 dark:bg-blue-500 h-2 sm:h-3 rounded-full transition-all duration-500 ease-out shadow-lg progress-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 sm:px-3 py-1 rounded-full shadow-sm">
          {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between overflow-x-auto pb-2 sm:pb-4 gap-1 sm:gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep - 1;
          const isCurrent = index === currentStep - 1;
          const isUpcoming = index > currentStep - 1;

          return (
            <div key={index} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 transform hover:scale-110 step-indicator ${
                    isCompleted 
                      ? "bg-green-500 dark:bg-green-600 text-white shadow-lg" 
                      : isCurrent 
                        ? "bg-blue-600 dark:bg-blue-500 text-white border-2 sm:border-4 border-white dark:border-gray-800 shadow-xl ring-2 sm:ring-4 ring-blue-200 dark:ring-blue-800 animate-pulse-glow" 
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span 
                  className={`text-xs mt-1 sm:mt-2 text-center max-w-12 sm:max-w-16 font-medium leading-tight ${
                    isCurrent ? "text-blue-600 dark:text-blue-400 font-bold" : isCompleted ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`w-8 sm:w-16 h-1 mx-1 sm:mx-3 rounded-full transition-all duration-300 ${
                    isCompleted ? "bg-green-500 dark:bg-green-600" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar; 