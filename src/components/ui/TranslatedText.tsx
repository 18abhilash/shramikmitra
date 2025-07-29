import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface TranslatedTextProps {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  children?: never;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({
  text,
  className = '',
  as: Component = 'span',
}) => {
  const { translate, currentLanguage } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translateText = async () => {
      if (currentLanguage === 'en') {
        setTranslatedText(text);
        return;
      }

      setIsLoading(true);
      try {
        const translated = await translate(text);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(text);
      } finally {
        setIsLoading(false);
      }
    };

    translateText();
  }, [text, currentLanguage, translate]);

  return (
    <Component className={`${className} ${isLoading ? 'opacity-70' : ''}`}>
      {translatedText}
    </Component>
  );
};