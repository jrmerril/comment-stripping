
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import CodeInput from "@/components/CodeInput";
import CodeOutput from "@/components/CodeOutput";
import { removeCommentLines } from "@/utils/codeUtils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Index = () => {
  const [inputCode, setInputCode] = useState<string>("");
  const [outputCode, setOutputCode] = useState<string>("");
  const [removeSpaces, setRemoveSpaces] = useState<boolean>(true);

  // Update output whenever input or removeSpaces setting changes
  useEffect(() => {
    setOutputCode(removeCommentLines(inputCode, removeSpaces));
  }, [inputCode, removeSpaces]);

  const handleClear = () => {
    setInputCode("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 p-4 md:p-8">
      <header className="max-w-5xl mx-auto w-full mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Code Comment Remover
        </h1>
        <p className="text-muted-foreground text-center mt-2">
          Paste your code below to automatically remove all lines that start with "//"
        </p>
      </header>

      <div className="flex-1 max-w-5xl mx-auto w-full">
        <div className="flex items-center space-x-2 mb-4 justify-end">
          <Checkbox 
            id="removeSpaces" 
            checked={removeSpaces}
            onCheckedChange={(checked) => setRemoveSpaces(checked as boolean)} 
          />
          <Label htmlFor="removeSpaces" className="text-sm font-medium cursor-pointer">
            Remove extra spaces
          </Label>
        </div>
        <Card className="shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="h-full">
                <CodeInput 
                  value={inputCode} 
                  onChange={setInputCode} 
                  onClear={handleClear}
                />
              </div>
              <div className="h-full">
                <CodeOutput value={outputCode} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="max-w-5xl mx-auto w-full mt-6 text-center text-sm text-muted-foreground">
        <p>Simply paste your code in the input area, and comment lines will be automatically removed.</p>
      </footer>
    </div>
  );
};

export default Index;
