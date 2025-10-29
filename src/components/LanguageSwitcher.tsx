
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t, availableLanguages } = useLanguage();

  // Language flag emojis
  const languageFlags: Record<string, string> = {
    'en': '🇺🇸',
    'ar': '🇸🇦',
    'fr': '🇫🇷',
    'es': '🇪🇸',
    'de': '🇩🇪',
    'it': '🇮🇹',
    'pt': '🇵🇹',
    'ru': '🇷🇺',
    'zh': '🇨🇳',
    'ja': '🇯🇵',
    'ko': '🇰🇷',
    'tr': '🇹🇷',
    'he': '🇮🇱',
    'ur': '🇵🇰',
    'fa': '🇮🇷',
    'hi': '🇮🇳',
    'bn': '🇧🇩',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Globe className="h-4 w-4" />
          <span>{t('app.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.length > 0 ? (
          availableLanguages.map((lang) => (
            <DropdownMenuItem 
              key={lang.code}
              onClick={() => setLanguage(lang.code)} 
              className={language === lang.code ? 'bg-secondary/50' : ''}
            >
              {languageFlags[lang.code] || '🌐'} {lang.name}
            </DropdownMenuItem>
          ))
        ) : (
          <>
            <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-secondary/50' : ''}>
              🇺🇸 {t('app.english')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('ar')} className={language === 'ar' ? 'bg-secondary/50' : ''}>
              🇸🇦 {t('app.arabic')}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
