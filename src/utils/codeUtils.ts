
/**
 * Removes all lines that start with "//" from the provided code
 */
export const removeCommentLines = (code: string): string => {
  if (!code) return '';
  
  // Split by line, filter out comment lines, and join back
  return code
    .split('\n')
    .filter(line => !line.trimStart().startsWith('//'))
    .join('\n');
};
