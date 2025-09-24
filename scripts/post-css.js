import { readFileSync, writeFileSync } from 'fs';

/**
 * Post-process CSS file to remove unwanted styles from vunor preset
 * @param {string} cssPath - Path to the CSS file to process
 */
export function postProcessCSS(cssPath) {
  try {
    let cssContent = readFileSync(cssPath, 'utf-8');

    // Remove __vunor_palette_options rule completely
    // This rule appears as a minified selector with a base64 encoded background-image
    cssContent = cssContent.replace(/__vunor_palette_options\s*\{[^}]*\}/g, '');

    // Clean up body styles - remove non --font properties
    cssContent = cssContent.replace(/body\s*\{[^}]*\}/g, (match) => {
      // Parse the body rule
      const startIdx = match.indexOf('{');
      const endIdx = match.lastIndexOf('}');
      const content = match.substring(startIdx + 1, endIdx);

      // Split by semicolon and filter for --font variables only
      const properties = content.split(';')
        .map(prop => prop.trim())
        .filter(prop => prop && prop.includes('--font'))
        .join('; ');

      // Only return body rule if there are font variables
      if (properties) {
        return `body { ${properties}; }`;
      }
      return '';
    });

    // Clean up any multiple spaces or empty lines
    cssContent = cssContent.replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n');

    writeFileSync(cssPath, cssContent);
    console.log('Post-processed CSS: removed custom preflights and cleaned body styles');
  } catch (e) {
    console.error('Failed to post-process CSS:', e);
  }
}