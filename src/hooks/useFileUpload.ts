import { useState, useCallback } from 'react';
import useAssetStore from '@/store/assetStore';
import AssetService from '@/services/assetService';

export interface UseFileUploadOptions {
  maxFiles?: number;
  maxSizeBytes?: number;
  acceptedFileTypes?: string[];
}

export interface UseFileUploadResult {
  files: File[];
  isUploading: boolean;
  progress: Record<string, number>;
  errors: string[];
  addFiles: (newFiles: File[]) => void;
  removeFile: (fileName: string) => void;
  clearFiles: () => void;
  uploadFiles: () => Promise<void>;
  cancelUpload: () => void;
}

const useFileUpload = (options: UseFileUploadOptions = {}): UseFileUploadResult => {
  const { 
    maxFiles = 10, 
    maxSizeBytes = 50 * 1024 * 1024, // 50MB default
    acceptedFileTypes
  } = options;
  
  const [errors, setErrors] = useState<string[]>([]);
  const [isCancelled, setIsCancelled] = useState(false);
  
  const {
    uploadedFiles,
    isUploading,
    uploadProgress,
    addUploadedFiles,
    removeUploadedFile,
    clearUploadedFiles,
    setUploadProgress,
    setIsUploading,
    setAssets,
  } = useAssetStore();
  
  const validateFile = useCallback((file: File): string | null => {
    // Size check
    if (file.size > maxSizeBytes) {
      return `File ${file.name} exceeds maximum size of ${maxSizeBytes / 1024 / 1024}MB`;
    }
    
    // Type check
    if (acceptedFileTypes && acceptedFileTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !acceptedFileTypes.includes(`.${fileExtension}`)) {
        return `File ${file.name} has an unsupported file type`;
      }
    }
    
    return null;
  }, [maxSizeBytes, acceptedFileTypes]);
  
  const addFiles = useCallback((newFiles: File[]) => {
    // Validate max files
    if (uploadedFiles.length + newFiles.length > maxFiles) {
      setErrors(prev => [...prev, `Maximum ${maxFiles} files allowed`]);
      return;
    }
    
    // Validate each file
    const validFiles: File[] = [];
    const newErrors: string[] = [];
    
    newFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });
    
    if (newErrors.length) {
      setErrors(prev => [...prev, ...newErrors]);
    }
    
    if (validFiles.length) {
      addUploadedFiles(validFiles);
    }
  }, [uploadedFiles.length, maxFiles, validateFile, addUploadedFiles]);
  
  const removeFile = useCallback((fileName: string) => {
    removeUploadedFile(fileName);
  }, [removeUploadedFile]);
  
  const clearFiles = useCallback(() => {
    clearUploadedFiles();
    setErrors([]);
  }, [clearUploadedFiles]);
  
  const uploadFiles = useCallback(async () => {
    if (uploadedFiles.length === 0) {
      setErrors(prev => [...prev, 'No files to upload']);
      return;
    }
    
    setIsUploading(true);
    setIsCancelled(false);
    setErrors([]);
    
    try {
      const updateProgress = (fileName: string, progress: number) => {
        if (!isCancelled) {
          setUploadProgress(fileName, progress);
        }
      };
      
      const newAssets = await AssetService.uploadAssets(uploadedFiles, updateProgress);
      
      if (!isCancelled) {
        // Update store with the new assets
        setAssets(prevAssets => [...prevAssets, ...newAssets]);
        clearUploadedFiles();
      }
    } catch (error) {
      if (!isCancelled) {
        setErrors(prev => [...prev, `Upload failed: ${(error as Error).message}`]);
      }
    } finally {
      if (!isCancelled) {
        setIsUploading(false);
      }
    }
  }, [uploadedFiles, isCancelled, setIsUploading, setUploadProgress, clearUploadedFiles, setAssets]);
  
  const cancelUpload = useCallback(() => {
    setIsCancelled(true);
    setIsUploading(false);
  }, [setIsUploading]);
  
  return {
    files: uploadedFiles,
    isUploading,
    progress: uploadProgress,
    errors,
    addFiles,
    removeFile,
    clearFiles,
    uploadFiles,
    cancelUpload
  };
};

export default useFileUpload;