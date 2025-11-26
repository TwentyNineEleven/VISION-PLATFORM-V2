import { describe, expect, it } from 'vitest';
import { documentParserService } from '../documentParserService';

const createFileFromString = (content: string, name: string, type: string): File => {
  const buffer = Buffer.from(content, 'utf-8');
  const slice = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

  return {
    name,
    size: buffer.byteLength,
    type,
    lastModified: Date.now(),
    arrayBuffer: async () => slice,
    text: async () => buffer.toString('utf-8'),
  } as unknown as File;
};

const SIMPLE_PDF_CONTENT = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT
/F1 24 Tf
72 712 Td
(Hello PDF) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000110 00000 n 
0000000210 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
300
%%EOF`;

const SIMPLE_DOCX_CONTENT =
  '<w:document><w:body><w:p><w:r><w:t>Hello DOCX</w:t></w:r></w:p></w:body></w:document>';

describe('documentParserService', () => {
  it('parses text from simple PDFs without placeholders', async () => {
    const file = createFileFromString(SIMPLE_PDF_CONTENT, 'hello.pdf', 'application/pdf');

    const result = await documentParserService.parsePDF(file);

    expect(result.success).toBe(true);
    expect(result.text).toContain('Hello PDF');
    expect(result.metadata?.pages).toBeGreaterThanOrEqual(1);
    expect(result.metadata?.words).toBeGreaterThan(0);
  });

  it('parses text from docx files using XML text nodes', async () => {
    const file = createFileFromString(
      SIMPLE_DOCX_CONTENT,
      'hello.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );

    const result = await documentParserService.parseWordDocument(file);

    expect(result.success).toBe(true);
    expect(result.text).toContain('Hello DOCX');
    expect(result.metadata?.words).toBeGreaterThan(0);
  });

  it('applies maxLength truncation when requested', async () => {
    const file = createFileFromString(SIMPLE_PDF_CONTENT, 'hello.pdf', 'application/pdf');

    const result = await documentParserService.parsePDF(file, { maxLength: 5 });

    expect(result.success).toBe(true);
    expect(result.text).toBe('Hello\n[Content truncated]');
    expect(result.metadata?.note).toBeDefined();
  });
});
