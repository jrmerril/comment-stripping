
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const CodeInput = ({ value, onChange, onClear }: CodeInputProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">Input Code</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your code here..."
        className="flex-grow font-mono text-sm h-full min-h-[300px] resize-none p-4"
        spellCheck={false}
      />
    </div>
  );
};

export default CodeInput;
