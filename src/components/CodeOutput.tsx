
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowUp, ArrowDown } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useTheme } from "next-themes";

interface CodeOutputProps {
  value: string;
}

const CodeOutput = ({ value }: CodeOutputProps) => {
  const outputRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard!");
    }
  };

  const scrollToTop = () => {
    if (outputRef.current) {
      outputRef.current.scrollTop = 0;
    }
  };

  const scrollToBottom = () => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">Output (Comments Removed)</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={scrollToTop}
            title="Scroll to top"
            disabled={!value}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={scrollToBottom}
            title="Scroll to bottom"
            disabled={!value}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCopy}
            disabled={!value}
          >
            Copy
          </Button>
        </div>
      </div>
      <div 
        ref={outputRef}
        className="relative flex-grow min-h-[450px] border rounded-md overflow-auto"
      >
        <SyntaxHighlighter
          language="javascript"
          style={isDarkTheme ? atomOneDark : atomOneLight}
          customStyle={{
            margin: 0,
            padding: '1rem',
            height: '100%',
            background: isDarkTheme ? 'rgb(17 24 39 / 0.8)' : 'rgb(219 234 254 / 0.5)',
          }}
        >
          {value || ' '}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeOutput;
