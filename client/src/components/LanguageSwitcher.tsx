// import { Globe } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useTranslation } from "@/contexts/TranslationContext";

// const languages = [
//   { code: "en", name: "English", flag: "🇺🇸" },
//   { code: "es", name: "Español", flag: "🇪🇸" },
//   { code: "fr", name: "Français", flag: "🇫🇷" },
// ] as const;

// export function LanguageSwitcher() {
//   const { language, setLanguage } = useTranslation();

//   const currentLang =
//     languages.find((l) => l.code === language) || languages[0];

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//           data-testid="button-language-switcher"
//         >
//           <Globe className="h-5 w-5 text-foreground" />
//           <span className="sr-only">Switch language</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         {languages.map((lang) => (
//           <DropdownMenuItem
//             key={lang.code}
//             onClick={() => setLanguage(lang.code as any)}
//             className="cursor-pointer"
//             data-testid={`option-language-${lang.code}`}
//           >
//             <span className="mr-2">{lang.flag}</span>
//             <span>{lang.name}</span>
//             {language === lang.code && (
//               <span className="ml-auto text-primary">✓</span>
//             )}
//           </DropdownMenuItem>
//         ))}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }



import ReactCountryFlag from "react-country-flag";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/contexts/TranslationContext";

const DEFAULT_LANGUAGE = {
  code: "en",
  name: "English",
  nativeName: "English",
  flagCode: "US",
};

export function LanguageSwitcher() {
  const { languages, languageCode, setLanguage, t } = useTranslation();

  const currentLanguage =
    languages?.find((l) => l.code === languageCode) ?? DEFAULT_LANGUAGE;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex items-center gap-2 rounded-full px-3 border-border/50"
        >
          <ReactCountryFlag
            countryCode={currentLanguage.flagCode}
            svg
            style={{ width: "18px", height: "14px" }}
          />
          <span className="text-sm font-medium">
            {currentLanguage.code.toUpperCase()}
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {t?.("common.button.selectLanguage") || "Select Language"}
        </div>

        {(languages || []).map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <ReactCountryFlag
                countryCode={lang.flagCode}
                svg
                style={{ width: "20px", height: "15px" }}
              />
              <div>
                <div className="font-medium">{lang.nativeName}</div>
                <div className="text-xs text-muted-foreground">
                  {lang.name}
                </div>
              </div>
            </div>

            {languageCode === lang.code && (
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-teal-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
