export type CategoryId =
  | 'math'
  | 'equations'
  | 'functions'
  | 'graphs'
  | 'geometry'
  | 'tables'
  | 'statistics'
  | 'probability'
  | 'tikz'
  | 'latex';

export interface Category {
  id: CategoryId;
  nameKh: string;
  nameEn: string;
  iconName: string;
  description: string;
  count: number;
}

export interface SampleItem {
  id: string;
  categoryId: CategoryId;
  titleKh: string;
  titleEn: string;
  description: string;
  thumbnailSvg?: string;
  latexCode: string;
  tikzCode?: string;
  mathContent?: string;
  note?: string;
  promptSuggestion?: string;
  typeBadge: string;
}

export interface UploadedFileItem {
  id: string;
  name: string;
  size: number;
  dataUrl: string; // base64
  mimeType: string;
  source: 'upload' | 'camera' | 'paste' | 'pdf' | 'sample';
  pageNumber?: number;
  totalPages?: number;
}

export type OutputMode = 'full' | 'tikz' | 'math';

export interface GenerationResult {
  latexCode: string;
  fullDocument: string;
  tikzOnly: string;
  mathContent: string;
  note: string;
  normalized: string;
  detectedType: string;
  timestamp: number;
}

export interface FilterOptions {
  bbt: boolean;
  dthi: boolean;
  hve: boolean;
  tikz: boolean;
}
