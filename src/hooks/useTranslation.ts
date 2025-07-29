import { useState, useEffect, useCallback } from 'react';
import { TranslationService } from '../services/translation';

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = useCallback((languageCode: string) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('preferred_language', languageCode);
  }, []);

  const translate = useCallback(async (text: string, targetLanguage?: string): Promise<string> => {
    if (!text) return text;
    
    const target = targetLanguage || currentLanguage;
    if (target === 'en') return text; // No translation needed for English
    
    setIsTranslating(true);
    try {
      const translated = await TranslationService.translateText(text, target);
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  const translateObject = useCallback(async (obj: any, fieldsToTranslate: string[], targetLanguage?: string): Promise<any> => {
    const target = targetLanguage || currentLanguage;
    if (target === 'en') return obj;
    
    setIsTranslating(true);
    try {
      const translated = await TranslationService.translateObject(obj, target, fieldsToTranslate);
      return translated;
    } catch (error) {
      console.error('Object translation error:', error);
      return obj;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  const getSupportedLanguages = useCallback(() => {
    return TranslationService.getSupportedLanguages();
  }, []);

  return {
    currentLanguage,
    isTranslating,
    changeLanguage,
    translate,
    translateObject,
    getSupportedLanguages,
  };
};