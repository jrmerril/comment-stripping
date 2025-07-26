
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
      lang.singleLineComments.some(commentStyle => {
        // Check if the line starts with the comment style
        if (trimmedLine.startsWith(commentStyle)) {
          // For // comments, make sure it's not part of a URL or other token
          if (commentStyle === '//') {
            // Look for common patterns that shouldn't be treated as comments
            // URLs like https://, http://, ftp://, etc.
            const urlPattern = /^https?:\/\/|^ftp:\/\/|^sftp:\/\/|^file:\/\/|^mailto:/i;
            if (urlPattern.test(trimmedLine)) {
              return false; // Don't treat as comment
            }
            // Check if it's part of a valid identifier or path
            // This handles cases like "path/to/file" or "namespace::method"
            const beforeComment = line.substring(0, line.indexOf('//')).trim();
            if (beforeComment && !beforeComment.endsWith(' ') && !beforeComment.endsWith('\t')) {
              return false; // Don't treat as comment if there's text before //
            }
          }
          return true; // It's a comment
        }
        return false; // Not a comment
      })
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
 * Filters code to only include blocks that contain the specified phrase
 * Preserves complete functions and variable declarations
 */
export const filterCodeByPhrase = (code: string, phrase: string): string => {
  if (!code || !phrase) return code;
  
  const lines = code.split('\n');
  const filteredLines: string[] = [];
  const phraseRegex = new RegExp(phrase, 'gi');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if current line contains the phrase
    if (phraseRegex.test(line)) {
      // Extract the complete block (function, class, variable declaration, etc.)
      const block = extractCompleteBlock(lines, i);
      
      // Add the block to filtered lines if not already added
      const blockStart = block.startLine;
      const blockEnd = block.endLine;
      
      // Check if this block is already included
      const alreadyIncluded = filteredLines.some((_, index) => {
        const existingBlockInfo = (filteredLines as any).blockInfo;
        return existingBlockInfo && 
               existingBlockInfo.some((info: any) => 
                 info.start <= blockStart && info.end >= blockEnd
               );
      });
      
      if (!alreadyIncluded) {
        // Add block info to track what we've added
        if (!(filteredLines as any).blockInfo) {
          (filteredLines as any).blockInfo = [];
        }
        (filteredLines as any).blockInfo.push({ start: blockStart, end: blockEnd });
        
        // Add the lines from the block
        for (let j = blockStart; j <= blockEnd; j++) {
          if (j < lines.length && !filteredLines.includes(lines[j])) {
            filteredLines.push(lines[j]);
          }
        }
        
        // Add a separator line for readability
        filteredLines.push('');
      }
    }
  }
  
  return filteredLines.join('\n').replace(/\n{3,}/g, '\n\n');
};

/**
 * Extracts a complete code block (function, class, etc.) starting from a given line
 */
function extractCompleteBlock(lines: string[], startLineIndex: number): { startLine: number, endLine: number } {
  const line = lines[startLineIndex];
  const indentation = getIndentation(line);
  
  // Find the start of the block by looking backwards for function/class/variable declarations
  let blockStart = startLineIndex;
  for (let i = startLineIndex; i >= 0; i--) {
    const currentLine = lines[i];
    const currentIndentation = getIndentation(currentLine);
    
    // If we find a line with less or equal indentation that looks like a declaration, that's our start
    if (currentIndentation <= indentation) {
      const trimmed = currentLine.trim();
      if (trimmed.match(/^(function|class|const|let|var|export|import|interface|type|enum|\w+\s*[=:]|\w+\s*\()/)) {
        blockStart = i;
        break;
      }
    }
    
    // Stop if we hit a line with significantly less indentation
    if (currentIndentation < indentation && currentLine.trim() !== '') {
      break;
    }
  }
  
  // Find the end of the block
  let blockEnd = startLineIndex;
  let braceCount = 0;
  let inBlock = false;
  
  for (let i = blockStart; i < lines.length; i++) {
    const currentLine = lines[i];
    const trimmed = currentLine.trim();
    
    // Count braces to find block boundaries
    braceCount += countBraces(currentLine);
    
    if (braceCount > 0) {
      inBlock = true;
    }
    
    blockEnd = i;
    
    // If we were in a block and braces are balanced, we're done
    if (inBlock && braceCount === 0) {
      break;
    }
    
    // For single-line declarations without braces
    if (!inBlock && i > blockStart && trimmed === '') {
      blockEnd = i - 1;
      break;
    }
  }
  
  return { startLine: blockStart, endLine: blockEnd };
}

/**
 * Gets the indentation level of a line
 */
function getIndentation(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
}

/**
 * Counts opening and closing braces in a line
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


