
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, ArrowDown } from "lucide-react";

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  title?: string;
}

const CodeInput = ({ value, onChange, onClear, title }: CodeInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToTop = () => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = 0;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(0, 0);
    }
  };

  const scrollToBottom = () => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">{title || 'Input Code'}</h2>
          {value && (
            <span className="text-sm text-muted-foreground">
              ({value.split('\n').length} {value.split('\n').length === 1 ? 'line' : 'lines'})
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={scrollToTop}
            title="Scroll to top"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={scrollToBottom}
            title="Scroll to bottom"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClear}
          >
            Clear
          </Button>
        </div>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your code here..."
        className="flex-grow font-mono text-sm h-full min-h-[250px] resize-y p-4 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
        spellCheck={false}
      />
    </div>
  );
};

export default CodeInput;
