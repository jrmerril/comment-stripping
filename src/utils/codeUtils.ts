
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
  removeSpaces: boolean = true
): string => {
  if (!code) return '';
  
  // Get configurations for selected languages
  const activeLanguages = supportedLanguages.filter(lang => 
    selectedLanguages.includes(lang.id)
  );
  
  // First, handle multi-line comments
  let result = code;
  
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
 * Helper function to escape special characters in regex patterns
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
