

import { ConvertedFile } from './api';


export type FileUploadStatus = 
  | 'idle'           
  | 'picking'        
  | 'uploading'      
  | 'converting'     
  | 'success'        
  | 'error';         


export interface FileUploadProgress {
  file: File | null;
  fileName: string;
  fileSize: number;
  uploadProgress: number;      
  status: FileUploadStatus;
  error?: string;
}

export interface PickedFile {
  uri: string;                
  name: string;
  size: number;
  mimeType: string;            
}


export type FileCategory = 
  | 'all'
  | 'pdf'
  | 'excel'
  | 'word'
  | 'image'
  | 'other';


export interface FileFilters {
  category: FileCategory;
  searchQuery: string;
  sortBy: 'date' | 'name' | 'size';
  sortOrder: 'asc' | 'desc';
}