export class TranslationService {
  private static cache = new Map<string, string>();
  private static apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;

  static async translateText(text: string, targetLanguage: string, sourceLanguage: string = 'auto'): Promise<string> {
    const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Mock translation for demo - replace with actual Google Translate API
      if (!this.apiKey || this.apiKey === 'demo_translate_key') {
        return this.mockTranslate(text, targetLanguage);
      }

      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          source: sourceLanguage,
          format: 'text',
        }),
      });

      const data = await response.json();
      const translatedText = data.data.translations[0].translatedText;
      
      this.cache.set(cacheKey, translatedText);
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  }

  static async translateObject(obj: any, targetLanguage: string, fieldsToTranslate: string[]): Promise<any> {
    const translated = { ...obj };
    
    for (const field of fieldsToTranslate) {
      if (obj[field]) {
        translated[field] = await this.translateText(obj[field], targetLanguage);
      }
    }
    
    return translated;
  }

  static async detectLanguage(text: string): Promise<string> {
    try {
      if (!this.apiKey || this.apiKey === 'demo_translate_key') {
        return 'en'; // Default to English for demo
      }

      const response = await fetch(`https://translation.googleapis.com/language/translate/v2/detect?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
        }),
      });

      const data = await response.json();
      return data.data.detections[0][0].language;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en';
    }
  }

  private static mockTranslate(text: string, targetLanguage: string): string {
    // Mock translations for demo purposes
    const translations: Record<string, Record<string, string>> = {
      'hi': {
        'Find Work': 'काम खोजें',
        'Find Workers': 'कामगार खोजें',
        'Messages': 'संदेश',
        'Construction': 'निर्माण',
        'Agriculture': 'कृषि',
        'Household': 'घरेलू',
        'Transportation': 'परिवहन',
        'Login': 'लॉगिन',
        'Sign Up': 'साइन अप',
        'Welcome Back': 'वापसी पर स्वागत',
        'Create Your Profile': 'अपनी प्रोफ़ाइल बनाएं',
        'Apply Now': 'अभी आवेदन करें',
        'View Details': 'विवरण देखें',
      },
      'es': {
        'Find Work': 'Buscar Trabajo',
        'Find Workers': 'Buscar Trabajadores',
        'Messages': 'Mensajes',
        'Construction': 'Construcción',
        'Agriculture': 'Agricultura',
        'Household': 'Hogar',
        'Transportation': 'Transporte',
        'Login': 'Iniciar Sesión',
        'Sign Up': 'Registrarse',
        'Welcome Back': 'Bienvenido de Vuelta',
        'Create Your Profile': 'Crear Tu Perfil',
        'Apply Now': 'Aplicar Ahora',
        'View Details': 'Ver Detalles',
      },
    };

    return translations[targetLanguage]?.[text] || text;
  }

  static getSupportedLanguages(): Array<{ code: string; name: string; nativeName: string }> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
      { code: 'zh', name: 'Chinese', nativeName: '中文' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
      { code: 'ko', name: 'Korean', nativeName: '한국어' },
    ];
  }
}