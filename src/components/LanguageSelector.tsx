
import React from 'react';
import { supportedLanguages } from "@/utils/codeUtils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onChange: (languages: string[]) => void;
}

const LanguageSelector = ({ selectedLanguages, onChange }: LanguageSelectorProps) => {
  const toggleLanguage = (languageId: string) => {
    if (selectedLanguages.includes(languageId)) {
      onChange(selectedLanguages.filter(id => id !== languageId));
    } else {
      onChange([...selectedLanguages, languageId]);
    }
  };

  const toggleAll = (checked: boolean) => {
    if (checked) {
      onChange(supportedLanguages.map(lang => lang.id));
    } else {
      onChange([]);
    }
  };

  const allSelected = supportedLanguages.length === selectedLanguages.length;

  return (
    <div className="border rounded-md p-4 mb-4 bg-background">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium">Comment Languages</h3>
        <div className="flex items-center gap-2">
          <Checkbox 
            id="select-all" 
            checked={allSelected}
            onCheckedChange={(checked) => toggleAll(!!checked)} 
          />
          <Label htmlFor="select-all" className="text-sm cursor-pointer">
            {allSelected ? "Deselect All" : "Select All"}
          </Label>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {supportedLanguages.map((lang) => (
          <div key={lang.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`lang-${lang.id}`} 
              checked={selectedLanguages.includes(lang.id)}
              onCheckedChange={() => toggleLanguage(lang.id)} 
            />
            <Label htmlFor={`lang-${lang.id}`} className="text-sm cursor-pointer">
              {lang.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
