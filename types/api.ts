
export interface User {
  _id: string;             
  first_name: string;       
  last_name: string;        
  email: string;            
  created_at?: string;      
}

export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}


export interface LoginRequest {
  email: string;
  password: string;
}


export interface LoginResponse {
  user: User;
  token: string;            
}


export interface ConvertedFile {
  _id: string;
  user_id: string;
  original_filename: string;
  converted_filename: string;
  file_type: string;         
  conversion_type: string;   
  file_size?: number;        
  cloud_url: string;         
  status: string;            
  created_at: string;        
}


export interface ConversionRequest {
  file: File | Blob;         
  conversion_type: string;  
}


export interface ConversionResponse {
  success: boolean;
  message: string;
  file: ConvertedFile;
}


export interface FilesListResponse {
  success: boolean;
  count: number;
  files: ConvertedFile[];
}


export interface DeleteFileResponse {
  success: boolean;
  message: string;
  file_id: string;
}


export interface ApiError {
  detail: string;            
  status_code?: number;      
}


export interface ApiSuccess {
  success: boolean;
  message: string;
}