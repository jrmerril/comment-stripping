
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">Output (Comments Removed)</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleCopy}
          disabled={!value}
        >
          Copy
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        readOnly
        className="flex-grow font-mono text-sm h-full min-h-[300px] resize-none bg-muted/30 p-4"
        spellCheck={false}
      />
    </div>
  );
};

export default CodeOutput;
