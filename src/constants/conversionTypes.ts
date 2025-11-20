
export const CONVERSION_TYPES = {
  // PDF Conversions
  PDF_TO_EXCEL: 'pdf_to_excel',
  PDF_TO_CSV: 'pdf_to_csv',
  PDF_TO_DOCX: 'pdf_to_docx',
  PDF_TO_POWERPOINT: 'pdf_to_powerpoint',
  COMPRESS_PDF: 'compress_pdf',
  EXTRACT_PDF_TEXT: 'extract_pdf_text',
  
  // Document Conversions
  DOCX_TO_PDF: 'docx_to_pdf',
  MARKDOWN_TO_PDF: 'markdown_to_pdf',
  
  // Data Conversions
  EXCEL_TO_JSON: 'excel_to_json',
  
  // Media Conversions
  IMAGE_TO_PDF: 'image_to_pdf',
  
  // Archive
  EXTRACT_ZIP: 'extract_zip',
} as const;


export type ConversionType = typeof CONVERSION_TYPES[keyof typeof CONVERSION_TYPES];



/**
 * Metadata for each conversion type
 * Used for UI display (labels, icons, descriptions)
 */
export interface ConversionMetadata {
  id: ConversionType;
  label: string;              
  description: string;    
  icon: string;              
  category: 'pdf' | 'document' | 'data' | 'media' | 'archive';
  sourceFormat: string;   
  targetFormat: string;    
  color: string;            
}

/**
 * Full metadata for all conversions
 * This powers your UI - carousel tiles, conversion grid, etc.
 */
export const CONVERSION_METADATA: Record<ConversionType, ConversionMetadata> = {
  [CONVERSION_TYPES.PDF_TO_EXCEL]: {
    id: CONVERSION_TYPES.PDF_TO_EXCEL,
    label: 'PDF to Excel',
    description: 'Extract tables from PDF to Excel spreadsheet',
    icon: 'file-spreadsheet',
    category: 'pdf',
    sourceFormat: 'PDF',
    targetFormat: 'XLSX',
    color: 'bg-green-500',
  },
  
  [CONVERSION_TYPES.PDF_TO_CSV]: {
    id: CONVERSION_TYPES.PDF_TO_CSV,
    label: 'PDF to CSV',
    description: 'Convert PDF tables to CSV format',
    icon: 'file-text',
    category: 'pdf',
    sourceFormat: 'PDF',
    targetFormat: 'CSV',
    color: 'bg-blue-500',
  },
  
  [CONVERSION_TYPES.PDF_TO_DOCX]: {
    id: CONVERSION_TYPES.PDF_TO_DOCX,
    label: 'PDF to Word',
    description: 'Convert PDF to editable Word document',
    icon: 'file-text',
    category: 'pdf',
    sourceFormat: 'PDF',
    targetFormat: 'DOCX',
    color: 'bg-blue-600',
  },
  
  [CONVERSION_TYPES.PDF_TO_POWERPOINT]: {
    id: CONVERSION_TYPES.PDF_TO_POWERPOINT,
    label: 'PDF to PowerPoint',
    description: 'Convert PDF to PowerPoint presentation',
    icon: 'presentation',
    category: 'pdf',
    sourceFormat: 'PDF',
    targetFormat: 'PPTX',
    color: 'bg-orange-500',
  },
  
  [CONVERSION_TYPES.COMPRESS_PDF]: {
    id: CONVERSION_TYPES.COMPRESS_PDF,
    label: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality',
    icon: 'compress',
    category: 'pdf',
    sourceFormat: 'PDF',
    targetFormat: 'PDF',
    color: 'bg-purple-500',
  },
  
  [CONVERSION_TYPES.EXTRACT_PDF_TEXT]: {
    id: CONVERSION_TYPES.EXTRACT_PDF_TEXT,
    label: 'Extract PDF Text',
    description: 'Extract all text content from PDF',
    icon: 'file-text',
    category: 'pdf',
    sourceFormat: 'PDF',
    targetFormat: 'TXT',
    color: 'bg-gray-500',
  },
  
  [CONVERSION_TYPES.DOCX_TO_PDF]: {
    id: CONVERSION_TYPES.DOCX_TO_PDF,
    label: 'Word to PDF',
    description: 'Convert Word document to PDF',
    icon: 'file-pdf',
    category: 'document',
    sourceFormat: 'DOCX',
    targetFormat: 'PDF',
    color: 'bg-red-500',
  },
  
  [CONVERSION_TYPES.MARKDOWN_TO_PDF]: {
    id: CONVERSION_TYPES.MARKDOWN_TO_PDF,
    label: 'Markdown to PDF',
    description: 'Convert Markdown to formatted PDF',
    icon: 'markdown',
    category: 'document',
    sourceFormat: 'MD',
    targetFormat: 'PDF',
    color: 'bg-indigo-500',
  },
  
  [CONVERSION_TYPES.EXCEL_TO_JSON]: {
    id: CONVERSION_TYPES.EXCEL_TO_JSON,
    label: 'Excel to JSON',
    description: 'Convert Excel spreadsheet to JSON data',
    icon: 'braces',
    category: 'data',
    sourceFormat: 'XLSX',
    targetFormat: 'JSON',
    color: 'bg-yellow-500',
  },
  
  [CONVERSION_TYPES.IMAGE_TO_PDF]: {
    id: CONVERSION_TYPES.IMAGE_TO_PDF,
    label: 'Image to PDF',
    description: 'Convert images to PDF document',
    icon: 'image',
    category: 'media',
    sourceFormat: 'JPG/PNG',
    targetFormat: 'PDF',
    color: 'bg-pink-500',
  },
  
  [CONVERSION_TYPES.EXTRACT_ZIP]: {
    id: CONVERSION_TYPES.EXTRACT_ZIP,
    label: 'Extract ZIP',
    description: 'Extract files from ZIP archive',
    icon: 'archive',
    category: 'archive',
    sourceFormat: 'ZIP',
    targetFormat: 'Files',
    color: 'bg-teal-500',
  },
};

/**
 * Helper functions for working with conversions
 */

/**
 * Get metadata for a specific conversion type
 */
export const getConversionMetadata = (type: ConversionType): ConversionMetadata => {
  return CONVERSION_METADATA[type];
};

/**
 * Get all conversions in a category
 */
export const getConversionsByCategory = (
  category: 'pdf' | 'document' | 'data' | 'media' | 'archive'
): ConversionMetadata[] => {
  return Object.values(CONVERSION_METADATA).filter(
    (conversion) => conversion.category === category
  );
};

/**
 * Get all conversion types as an array
 */
export const getAllConversions = (): ConversionMetadata[] => {
  return Object.values(CONVERSION_METADATA);
};

/**
 * Get popular conversions (for home screen carousel)
 * You can customize this based on usage analytics later
 */
export const getPopularConversions = (): ConversionMetadata[] => {
  return [
    CONVERSION_METADATA[CONVERSION_TYPES.PDF_TO_EXCEL],
    CONVERSION_METADATA[CONVERSION_TYPES.IMAGE_TO_PDF],
    CONVERSION_METADATA[CONVERSION_TYPES.DOCX_TO_PDF],
    CONVERSION_METADATA[CONVERSION_TYPES.PDF_TO_DOCX],
    CONVERSION_METADATA[CONVERSION_TYPES.COMPRESS_PDF],
  ];
};