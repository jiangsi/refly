import { ARTIFACT_THINKING_TAG_REGEX, ARTIFACT_TAG_REGEX } from './const';

/**
 * Replace all line breaks in the matched `reflyCanvas` tag with an empty string
 */
export const processWithArtifact = (input = '') => {
  let output = input;
  const thinkMatch = ARTIFACT_THINKING_TAG_REGEX.exec(input);

  // If the input contains the `reflyThinking` tag, replace all line breaks with an empty string
  if (thinkMatch)
    output = input.replace(ARTIFACT_THINKING_TAG_REGEX, (match) =>
      match.replaceAll(/\r?\n|\r/g, ''),
    );

  const match = ARTIFACT_TAG_REGEX.exec(input);
  // If the input contains the `reflyCanvas` tag, replace all line breaks with an empty string
  if (match)
    return output.replace(ARTIFACT_TAG_REGEX, (match) => match.replaceAll(/\r?\n|\r/g, ''));

  // if not match, check if it's start with <reflyCanvas but not closed
  const regex = /<reflyArtifact\b(?:(?!\/?>)[\S\s])*$/;
  if (regex.test(output)) {
    return output.replace(regex, '<reflyArtifact>');
  }

  return output;
};

export const getArtifactContent = (content: string) => {
  // Find the position of the first closing bracket of the opening tag
  const openTagEndPos = content.indexOf('>', content.indexOf('<reflyArtifact'));
  if (openTagEndPos === -1) {
    return '';
  }

  // Find the position of the closing tag
  const closeTagStartPos = content.lastIndexOf('</reflyArtifact>');

  // Extract content between opening and closing tags
  if (closeTagStartPos > -1) {
    return content.substring(openTagEndPos + 1, closeTagStartPos).trim();
  }

  // No closing tag found, extract till the end
  return content.substring(openTagEndPos + 1).trim();
};

// Function to extract content and attributes from artifact tag
export const getArtifactContentAndAttributes = (content: string) => {
  // Step 1: Find the opening tag and extract all attributes
  const openingTagRegex = /<reflyArtifact\b([^>]*)>/;
  const openingMatch = openingTagRegex.exec(content);
  const attributes: Record<string, string> = {};

  if (openingMatch && openingMatch.length > 1) {
    const attrStr = openingMatch[1];
    // Use a regex that can handle quoted attribute values potentially containing spaces and special chars
    const attrRegex = /(\w+)=["']([^"']*)["']/g;
    let match: RegExpExecArray | null = null;

    // Extract all attributes using regex
    match = attrRegex.exec(attrStr);
    while (match !== null) {
      attributes[match[1]] = match[2];
      match = attrRegex.exec(attrStr);
    }
  }

  // Step 2: Extract the content between opening and closing tags
  // We'll use a more precise approach to get everything between tags
  let contentValue = '';

  // Find the position of the first closing bracket of the opening tag
  const openTagEndPos = content.indexOf('>', content.indexOf('<reflyArtifact'));
  if (openTagEndPos > -1) {
    // Find the position of the closing tag
    const closeTagStartPos = content.lastIndexOf('</reflyArtifact>');

    if (closeTagStartPos > -1) {
      // Extract content between opening and closing tags
      contentValue = content.substring(openTagEndPos + 1, closeTagStartPos).trim();
    } else {
      // No closing tag found, extract till the end
      contentValue = content.substring(openTagEndPos + 1).trim();
    }
  }

  return {
    content: contentValue,
    title: attributes.title || '',
    language: attributes.language || 'typescript',
    type: attributes.type || '',
    // Include all other attributes
    ...attributes,
  };
};

// Function to extract content from reflyThinking tag
export const getReflyThinkingContent = (content: string) => {
  // Find the position of the first closing bracket of the opening tag
  const openTagEndPos = content.indexOf('>', content.indexOf('<reflyThinking'));
  if (openTagEndPos === -1) {
    return '';
  }

  // Find the position of the closing tag
  const closeTagStartPos = content.lastIndexOf('</reflyThinking>');

  // Extract content between opening and closing tags
  if (closeTagStartPos > -1) {
    return content.substring(openTagEndPos + 1, closeTagStartPos).trim();
  }

  // No closing tag found, extract till the end
  return content.substring(openTagEndPos + 1).trim();
};

// Function to extract content and attributes from reflyThinking tag
export const getReflyThinkingContentAndAttributes = (content: string) => {
  // Step 1: Find the opening tag and extract all attributes
  const openingTagRegex = /<reflyThinking\b([^>]*)>/;
  const openingMatch = openingTagRegex.exec(content);
  const attributes: Record<string, string> = {};

  if (openingMatch && openingMatch.length > 1) {
    const attrStr = openingMatch[1];
    // Use a regex that can handle quoted attribute values potentially containing spaces and special chars
    const attrRegex = /(\w+)=["']([^"']*)["']/g;
    let match: RegExpExecArray | null = null;

    // Extract all attributes using regex
    match = attrRegex.exec(attrStr);
    while (match !== null) {
      attributes[match[1]] = match[2];
      match = attrRegex.exec(attrStr);
    }
  }

  // Step 2: Extract the content between opening and closing tags
  // We'll use a more precise approach to get everything between tags
  let contentValue = '';

  // Find the position of the first closing bracket of the opening tag
  const openTagEndPos = content.indexOf('>', content.indexOf('<reflyThinking'));
  if (openTagEndPos > -1) {
    // Find the position of the closing tag
    const closeTagStartPos = content.lastIndexOf('</reflyThinking>');

    if (closeTagStartPos > -1) {
      // Extract content between opening and closing tags
      contentValue = content.substring(openTagEndPos + 1, closeTagStartPos).trim();
    } else {
      // No closing tag found, extract till the end
      contentValue = content.substring(openTagEndPos + 1).trim();
    }
  }

  return {
    content: contentValue,
    // Include all other attributes
    ...attributes,
  };
};
