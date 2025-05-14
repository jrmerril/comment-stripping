
/**
 * Removes all lines that start with "//" from the provided code
 * Optionally removes extra spaces if enabled
 */
export const removeCommentLines = (code: string, removeSpaces: boolean = true): string => {
  if (!code) return '';
  
  // Split by line, filter out comment lines, and join back
  let result = code
    .split('\n')
    .filter(line => !line.trimStart().startsWith('//'))
    .join('\n');
    
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
