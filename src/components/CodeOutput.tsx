
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowUp, ArrowDown } from "lucide-react";

interface CodeOutputProps {
  value: string;
}

const CodeOutput = ({ value }: CodeOutputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard!");
    }
  };

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
      <Textarea
        ref={textareaRef}
        value={value}
        readOnly
        className="flex-grow font-mono text-sm h-full min-h-[450px] resize-none bg-blue-50/50 dark:bg-blue-950/20 p-4 text-blue-800 dark:text-blue-200"
        spellCheck={false}
      />
    </div>
  );
};

export default CodeOutput;
