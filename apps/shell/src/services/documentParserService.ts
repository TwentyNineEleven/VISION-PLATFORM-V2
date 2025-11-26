/**
 * Document Parser Service
 * 
 * Handles text extraction from various file types.
 * This service works WITHOUT AI - it uses standard libraries for parsing.
 * Text extraction is always performed, AI processing is optional.
 */

import { getFileExtension } from '@/utils/documentUtils';

// ============================================================================
// TYPES
// ============================================================================

export interface ParseResult {
  success: boolean;
  text?: string;
  textLength?: number;
  error?: string;
  metadata?: {
    pages?: number;
    words?: number;
    characters?: number;
    language?: string;
    author?: string;
    title?: string;
    subject?: string;
    keywords?: string[];
    createdDate?: string;
    modifiedDate?: string;
    note?: string;
  };
}

export interface ParserOptions {
  extractMetadata?: boolean;
  maxLength?: number; // Maximum text length to extract
  includeFormatting?: boolean;
}

const applyMaxLength = (text: string, maxLength?: number) => {
  if (!maxLength || text.length <= maxLength) {
    return { text, truncated: false } as const;
  }

  return {
    text: `${text.substring(0, maxLength)}\n[Content truncated]`,
    truncated: true,
  } as const;
};

const decodeXmlEntities = (value?: string) =>
  value
    ?.replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();

const decodeBuffer = (buffer: ArrayBuffer) => {
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder().decode(buffer);
  }

  // Fallback for environments without TextDecoder (unlikely)
  // eslint-disable-next-line no-undef
  return Buffer.from(buffer).toString('utf-8');
};

const readFileText = async (file: File) => {
  if (typeof (file as unknown as { text?: () => Promise<string> }).text === 'function') {
    return (file as unknown as { text: () => Promise<string> }).text();
  }

  if (typeof (file as unknown as { arrayBuffer?: () => Promise<ArrayBuffer> }).arrayBuffer === 'function') {
    return decodeBuffer(await (file as unknown as { arrayBuffer: () => Promise<ArrayBuffer> }).arrayBuffer());
  }

  const buffer = await new Response(file as unknown as BodyInit).arrayBuffer();
  return decodeBuffer(buffer);
};

// ============================================================================
// MAIN PARSER SERVICE
// ============================================================================

export const documentParserService = {
  /**
   * Parse file and extract text based on MIME type
   * This is the main entry point for text extraction
   */
  async parseFile(
    file: File,
    options: ParserOptions = {}
  ): Promise<ParseResult> {
    try {
      const mimeType = file.type;
      const extension = getFileExtension(file.name);

      // Route to appropriate parser based on type
      if (mimeType === 'application/pdf' || extension === 'pdf') {
        return await this.parsePDF(file, options);
      }

      if (
        mimeType.includes('word') ||
        mimeType.includes('document') ||
        ['doc', 'docx'].includes(extension)
      ) {
        return await this.parseWordDocument(file, options);
      }

      if (mimeType.startsWith('text/') || ['txt', 'md', 'log'].includes(extension)) {
        return await this.parseTextFile(file, options);
      }

      if (
        mimeType.includes('sheet') ||
        mimeType.includes('excel') ||
        ['xls', 'xlsx', 'csv'].includes(extension)
      ) {
        return await this.parseSpreadsheet(file, options);
      }

      if (
        mimeType.includes('presentation') ||
        mimeType.includes('powerpoint') ||
        ['ppt', 'pptx'].includes(extension)
      ) {
        return await this.parsePresentation(file, options);
      }

      if (mimeType.startsWith('image/')) {
        return await this.parseImage(file, options);
      }

      if (mimeType === 'application/json' || extension === 'json') {
        return await this.parseJSON(file, options);
      }

      if (mimeType === 'application/xml' || extension === 'xml') {
        return await this.parseXML(file, options);
      }

      // Unsupported file type - no text extraction
      return {
        success: true,
        text: '',
        textLength: 0,
        metadata: {
          words: 0,
          characters: 0,
        },
      };
    } catch (error) {
      console.error('Error parsing file:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown parsing error',
      };
    }
  },

  /**
   * Extract text from PDF files
   * Note: This is a placeholder. In production, you would use a library like:
   * - pdf-parse (Node.js)
   * - PDF.js (browser)
   * - pdfjs-dist
   */
  async parsePDF(file: File, options: ParserOptions = {}): Promise<ParseResult> {
    try {
      const rawContent = await readFileText(file);
      const extractedText =
        [...rawContent.matchAll(/\(([^\)]*)\)\s*Tj/g)]
          .map(match => match[1]?.replace(/\\([()\\])/g, '$1')?.trim())
          .filter(Boolean)
          .join(' ')
          .trim() ||
        rawContent.replace(/[^\x09\x0A\x0D\x20-\x7E]+/g, ' ').trim();

      const { text, truncated } = applyMaxLength(extractedText, options.maxLength);
      const words = text.split(/\s+/).filter(Boolean);

      return {
        success: true,
        text,
        textLength: text.length,
        metadata: {
          pages: (rawContent.match(/\/Type\s*\/Page/g) || []).length || 1,
          words: words.length,
          characters: text.length,
          ...(truncated ? { note: 'Content truncated for maxLength' } : {}),
        },
      };
    } catch (error) {
      console.error('PDF parsing failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PDF parsing failed',
      };
    }
  },

  /**
   * Extract text from Word documents
   * Note: This is a placeholder. In production, you would use:
   * - mammoth (for .docx)
   * - officegen (for creation)
   */
  async parseWordDocument(file: File, options: ParserOptions = {}): Promise<ParseResult> {
    try {
      const xmlLikeContent = await readFileText(file);
      const textNodes = [
        ...xmlLikeContent.matchAll(/<w:t[^>]*>(.*?)<\/w:t>/g),
        ...xmlLikeContent.matchAll(/<t[^>]*>(.*?)<\/t>/g),
      ]
        .map(match => decodeXmlEntities(match[1]))
        .filter(Boolean);

      const extractedText = textNodes.join(' ').trim();
      const fallbackText =
        extractedText || xmlLikeContent.replace(/[^\x09\x0A\x0D\x20-\x7E]+/g, ' ').trim();

      const { text, truncated } = applyMaxLength(fallbackText, options.maxLength);
      const words = text.split(/\s+/).filter(Boolean);

      return {
        success: true,
        text,
        textLength: text.length,
        metadata: {
          words: words.length,
          characters: text.length,
          ...(truncated ? { note: 'Content truncated for maxLength' } : {}),
        },
      };
    } catch (error) {
      console.error('Word document parsing failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Word document parsing failed',
      };
    }
  },

  /**
   * Extract text from plain text files
   * This one actually works without additional libraries!
   */
  async parseTextFile(file: File, options: ParserOptions = {}): Promise<ParseResult> {
    try {
      let text = await file.text();

      // Apply max length if specified
      if (options.maxLength && text.length > options.maxLength) {
        text = text.substring(0, options.maxLength) + '\n[Content truncated]';
      }

      const words = text.split(/\s+/).filter(w => w.length > 0);

      return {
        success: true,
        text,
        textLength: text.length,
        metadata: {
          words: words.length,
          characters: text.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Text file parsing failed',
      };
    }
  },

  /**
   * Extract text from spreadsheet files
   * Note: This is a placeholder. In production, you would use:
   * - xlsx (for Excel files)
   * - papaparse (for CSV files)
   */
  async parseSpreadsheet(file: File, options: ParserOptions = {}): Promise<ParseResult> {
    try {
      const extension = getFileExtension(file.name);

      // Handle CSV files (these work without additional libraries)
      if (extension === 'csv' || file.type === 'text/csv') {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim().length > 0);

        return {
          success: true,
          text,
          textLength: text.length,
          metadata: {
            words: text.split(/\s+/).length,
            characters: text.length,
          },
        };
      }

      // For Excel files, need a library
      const text = `[Excel spreadsheet extraction requires xlsx library]
      
File: ${file.name}
Size: ${file.size} bytes
Type: ${file.type}

To enable Excel parsing, install: npm install xlsx
Then implement the parsing logic in this method.`;

      return {
        success: true,
        text,
        textLength: text.length,
        metadata: {
          words: text.split(/\s+/).length,
          characters: text.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Spreadsheet parsing failed',
      };
    }
  },

  /**
   * Extract text from presentation files
   * Note: This is a placeholder. Libraries needed for full support.
   */
  async parsePresentation(file: File, options: ParserOptions = {}): Promise<ParseResult> {
    try {
      const text = `[PowerPoint extraction requires officegen or similar library]
      
File: ${file.name}
Size: ${file.size} bytes
Type: ${file.type}

Presentation files require specialized parsing libraries.`;

      return {
        success: true,
        text,
        textLength: text.length,
        metadata: {
          words: text.split(/\s+/).length,
          characters: text.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Presentation parsing failed',
      };
    }
  },

  /**
   * Extract text from images using OCR
   * Note: This is a placeholder. In production, you would use:
   * - tesseract.js (client-side OCR)
   * - Or call an OCR API service
   */
  async parseImage(file: File, options: ParserOptions = {}): Promise<ParseResult> {
    try {
      // Images don't have extractable text without OCR
      // OCR is computationally expensive and should be optional
      
      const text = `[Image text extraction requires OCR]
      
File: ${file.name}
Size: ${file.size} bytes
Type: ${file.type}
Dimensions: [Would need to read image to determine]

To enable OCR, you can:
1. Install tesseract.js for client-side OCR
2. Use a cloud OCR service (Google Vision, AWS Textract, etc.)
3. Or mark images as not containing extractable text`;

      return {
        success: true,
        text: '', // No text extracted without OCR
        textLength: 0,
        metadata: {
          words: 0,
          characters: 0,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Image parsing failed',
      };
    }
  },

  /**
   * Extract text from JSON files
   * This works without additional libraries!
   */
  async parseJSON(file: File, options: ParserOptions = {}): Promise<ParseResult> {
    try {
      const text = await file.text();
      let jsonData: any;

      try {
        jsonData = JSON.parse(text);
      } catch {
        // If not valid JSON, just return the text
        return {
          success: true,
          text,
          textLength: text.length,
          metadata: {
            words: text.split(/\s+/).length,
            characters: text.length,
          },
        };
      }

      // Pretty print JSON for better readability
      const prettyText = JSON.stringify(jsonData, null, 2);

      return {
        success: true,
        text: prettyText,
        textLength: prettyText.length,
        metadata: {
          words: prettyText.split(/\s+/).length,
          characters: prettyText.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'JSON parsing failed',
      };
    }
  },

  /**
   * Extract text from XML files
   * This works without additional libraries!
   */
  async parseXML(file: File, options: ParserOptions = {}): Promise<ParseResult> {
    try {
      const text = await file.text();

      return {
        success: true,
        text,
        textLength: text.length,
        metadata: {
          words: text.split(/\s+/).length,
          characters: text.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'XML parsing failed',
      };
    }
  },

  /**
   * Extract basic metadata from any file
   */
  extractBasicMetadata(file: File): ParseResult['metadata'] {
    return {
      // File system metadata
      words: 0, // Will be calculated after text extraction
      characters: 0, // Will be calculated after text extraction
    };
  },

  /**
   * Count words in text
   */
  countWords(text: string): number {
    return text.split(/\s+/).filter(w => w.length > 0).length;
  },

  /**
   * Detect language (basic heuristic)
   * Note: For production, use a library like franc or languagedetect
   */
  detectLanguage(text: string): string {
    // Very basic language detection
    // In production, use a proper language detection library
    
    if (!text || text.length < 50) return 'unknown';
    
    // Simple heuristic: check for common words
    const lowerText = text.toLowerCase();
    
    // English common words
    const englishWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a'];
    const englishCount = englishWords.filter(word => 
      lowerText.includes(` ${word} `)
    ).length;
    
    if (englishCount >= 3) return 'en';
    
    return 'unknown';
  },

  /**
   * Sanitize extracted text (remove special characters, normalize whitespace)
   */
  sanitizeText(text: string): string {
    return text
      // Remove null bytes
      .replace(/\0/g, '')
      // Normalize line endings
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remove excessive whitespace
      .replace(/[ \t]+/g, ' ')
      // Remove excessive newlines
      .replace(/\n{3,}/g, '\n\n')
      // Trim
      .trim();
  },
};

// ============================================================================
// EXPORT
// ============================================================================

  export default documentParserService;
