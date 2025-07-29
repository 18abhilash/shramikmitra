import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage, getSupportedLanguages } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const languages = getSupportedLanguages();
  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Globe size={16} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentLang?.nativeName || 'English'}
        </span>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48"
        >
          <div className="py-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  changeLanguage(language.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                  currentLanguage === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{language.nativeName}</span>
                  <span className="text-sm text-gray-500">{language.name}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};