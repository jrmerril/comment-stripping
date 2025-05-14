
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, ArrowDown } from "lucide-react";
import { SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useTheme } from "next-themes";

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const CodeInput = ({ value, onChange, onClear }: CodeInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

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
        <h2 className="text-lg font-medium">Input Code</h2>
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
      <div className="relative flex-grow min-h-[450px] border rounded-md overflow-hidden">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your code here..."
          className="absolute inset-0 font-mono text-sm h-full resize-none p-4 bg-transparent z-10"
          spellCheck={false}
          style={{ color: 'transparent', caretColor: isDarkTheme ? 'white' : 'black' }}
        />
        <div className="absolute inset-0 overflow-auto">
          <SyntaxHighlighter
            language="javascript"
            style={isDarkTheme ? atomOneDark : atomOneLight}
            customStyle={{
              margin: 0,
              padding: '1rem',
              height: '100%',
              background: isDarkTheme ? 'rgb(15 23 42)' : 'rgb(248 250 252)',
            }}
          >
            {value || ' '}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default CodeInput;
