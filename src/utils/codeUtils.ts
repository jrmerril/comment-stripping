
/**
 * Language configuration for comment styles
 */
export interface LanguageConfig {
  id: string;
  name: string;
  singleLineComments: string[];
  multiLineCommentStart?: string[];
  multiLineCommentEnd?: string[];
}

/**
 * Supported programming languages and their comment styles
 */
export const supportedLanguages: LanguageConfig[] = [
  {
    id: 'js',
    name: 'JavaScript/TypeScript',
    singleLineComments: ['//'],
    multiLineCommentStart: ['/*'],
    multiLineCommentEnd: ['*/'],
  },
  {
    id: 'html',
    name: 'HTML/XML',
    singleLineComments: [],
    multiLineCommentStart: ['<!--'],
    multiLineCommentEnd: ['-->'],
  },
  {
    id: 'css',
    name: 'CSS/SCSS',
    singleLineComments: [],
    multiLineCommentStart: ['/*'],
    multiLineCommentEnd: ['*/'],
  },
  {
    id: 'python',
    name: 'Python',
    singleLineComments: ['#'],
    multiLineCommentStart: ["'''", '"""'],
    multiLineCommentEnd: ["'''", '"""'],
  },
  {
    id: 'ruby',
    name: 'Ruby',
    singleLineComments: ['#'],
    multiLineCommentStart: ['=begin'],
    multiLineCommentEnd: ['=end'],
  },
  {
    id: 'jsx',
    name: 'JSX/TSX/React',
    singleLineComments: ['//'],
    multiLineCommentStart: ['/*', '{/*'],
    multiLineCommentEnd: ['*/', '*/}'],
  },
  {
    id: 'shell',
    name: 'Shell/Bash',
    singleLineComments: ['#'],
  },
  {
    id: 'sql',
    name: 'SQL',
    singleLineComments: ['--'],
    multiLineCommentStart: ['/*'],
    multiLineCommentEnd: ['*/'],
  }
];

/**
 * Removes comments from code based on selected languages
 * @param code The source code
 * @param selectedLanguages Array of language IDs to process
 * @param removeSpaces Whether to clean up extra spaces
 * @returns Code with comments removed
 */
export const removeCommentLines = (
  code: string,
  selectedLanguages: string[] = supportedLanguages.map(lang => lang.id),
  removeSpaces: boolean = true,
  removePlusMinus: boolean = false,
  removeInlineComments: boolean = true
): string => {
  if (!code) return '';
  
  // Get configurations for selected languages
  const activeLanguages = supportedLanguages.filter(lang => 
    selectedLanguages.includes(lang.id)
  );
  
  // First, handle multi-line comments
  let result = code;
  
  // Remove +/- symbols if requested
  if (removePlusMinus) {
    result = result.replace(/^\s*[+-]\s*/gm, '');
  }

  // Remove inline comments if requested
  if (removeInlineComments) {
    const singleLineCommentRegex = activeLanguages
      .flatMap(lang => lang.singleLineComments)
      .map(comment => `\s*${escapeRegExp(comment)}.*$`)
      .join('|');
    
    if (singleLineCommentRegex) {
      result = result.replace(new RegExp(`(${singleLineCommentRegex})`, 'gm'), '');
    }
  }
  
  // Process each language's multi-line comment style
  for (const lang of activeLanguages) {
    if (lang.multiLineCommentStart && lang.multiLineCommentEnd) {
      for (let i = 0; i < lang.multiLineCommentStart.length; i++) {
        const startPattern = lang.multiLineCommentStart[i];
        const endPattern = lang.multiLineCommentEnd[i];
        
        if (startPattern && endPattern) {
          // Replace multi-line comments with newlines to preserve line numbers
          const multiLineRegex = new RegExp(
            escapeRegExp(startPattern) + '[\\s\\S]*?' + escapeRegExp(endPattern),
            'g'
          );
          
          result = result.replace(multiLineRegex, match => {
            // Count newlines in the match and return that many newlines
            const newlineCount = (match.match(/\n/g) || []).length;
            return '\n'.repeat(newlineCount);
          });
        }
      }
    }
  }
  
  // Then handle single-line comments line by line
  const lines = result.split('\n');
  const filteredLines = lines.filter(line => {
    const trimmedLine = line.trimStart();
    // Check if line starts with any of the single line comment markers
    return !activeLanguages.some(lang => 
      lang.singleLineComments.some(commentStyle => 
        trimmedLine.startsWith(commentStyle)
      )
    );
  });
  
  result = filteredLines.join('\n');
  
  // Remove extra spaces if enabled
  if (removeSpaces) {
    result = result
      .replace(/[ \t]+\n/g, '\n')  // Remove trailing spaces
      .replace(/\n{3,}/g, '\n\n')  // Replace 3+ consecutive new lines with 2
      .replace(/^[ \t]+/gm, match => {  // Convert tabs to 2 spaces and normalize indentation
        return ' '.repeat(match.replace(/\t/g, '  ').length);
      });
  }
  
  return result;
};

/**
 * Filters code to only include lines/blocks containing a specific phrase
 * Preserves complete functions and declarations
 * @param code The source code
 * @param filterPhrase The phrase to filter by (case insensitive)
 * @returns Filtered code with complete code blocks preserved
 */
export const filterCodeByPhrase = (code: string, filterPhrase: string): string => {
  if (!code || !filterPhrase.trim()) return code;
  
  const lines = code.split('\n');
  const filteredLines: string[] = [];
  const phrase = filterPhrase.toLowerCase();
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes(phrase)) {
      // Check if this line is part of a function/class/block definition
      const blockLines = extractCompleteBlock(lines, i);
      filteredLines.push(...blockLines);
      i += blockLines.length - 1; // Skip the lines we just added
    }
  }
  
  return filteredLines.join('\n');
};

/**
 * Extracts a complete code block (function, class, etc.) starting from a given line
 * @param lines Array of code lines
 * @param startIndex Index of the line that contains the phrase
 * @returns Array of lines representing the complete block
 */
function extractCompleteBlock(lines: string[], startIndex: number): string[] {
  const startLine = lines[startIndex];
  const trimmedStart = startLine.trim();
  
  // Check if this looks like a function/class/variable declaration
  const isDeclaration = /^(function|def|class|const|let|var|public|private|protected|static|async|export|interface|type|enum)\s+/.test(trimmedStart) ||
                       /\s*(=\s*function|\s*:\s*function|\s*=\s*\(|\s*=\s*async|\s*=\s*\{|\s*=\s*\[)/.test(startLine) ||
                       /\{[^}]*$/.test(startLine); // Line ends with opening brace
  
  if (!isDeclaration) {
    // If it's not a declaration, just return this line
    return [startLine];
  }
  
  // Find the complete block by matching braces/indentation
  const result: string[] = [startLine];
  const baseIndentation = getIndentation(startLine);
  let braceCount = countBraces(startLine);
  let i = startIndex + 1;
  
  while (i < lines.length) {
    const currentLine = lines[i];
    result.push(currentLine);
    braceCount += countBraces(currentLine);
    
    // If braces are balanced and we're back to base indentation (or less), we're done
    if (braceCount <= 0 && getIndentation(currentLine) <= baseIndentation && currentLine.trim() !== '') {
      break;
    }
    
    // Safety check: don't go beyond reasonable block size
    if (result.length > 100) break;
    
    i++;
  }
  
  return result;
}

/**
 * Gets the indentation level of a line
 */
function getIndentation(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
}

/**
 * Counts opening braces minus closing braces in a line
 */
function countBraces(line: string): number {
  const openBraces = (line.match(/[{([]/g) || []).length;
  const closeBraces = (line.match(/[})]/g) || []).length;
  return openBraces - closeBraces;
}

/**
 * Helper function to escape special characters in regex patterns
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
