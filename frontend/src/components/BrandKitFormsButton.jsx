import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Palette } from 'lucide-react';

const BrandKitFormsButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/know-your-form');
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
    >
      <FileText className="w-5 h-5" />
      <span className="text-lg">Brand Kit Forms</span>
      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center">
        <Palette className="w-3 h-3 text-white" />
      </div>
    </button>
  );
};

export default BrandKitFormsButton; 