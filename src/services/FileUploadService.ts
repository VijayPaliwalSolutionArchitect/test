/**
 * File Upload Service - Handles file uploads to cloud storage
 */

import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.shivamitcs.in';

export interface UploadedFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
  fileId: string;
}

export class FileUploadService {
  // Request presigned URL from backend
  static async requestPresignedUrl(
    fileName: string,
    fileType: string,
    fileSize: number
  ): Promise<PresignedUrlResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/media/presign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add auth token
        },
        body: JSON.stringify({
          fileName,
          contentType: fileType,
          fileSize,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get presigned URL');
      }

      return await response.json();
    } catch (error) {
      console.error('Error requesting presigned URL:', error);
      throw error;
    }
  }

  // Upload file using presigned URL
  static async uploadWithPresignedUrl(
    fileUri: string,
    uploadUrl: string,
    fileType: string,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    try {
      const uploadResult = await FileSystem.uploadAsync(uploadUrl, fileUri, {
        httpMethod: 'PUT',
        headers: {
          'Content-Type': fileType,
        },
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      });

      if (uploadResult.status !== 200) {
        throw new Error('Upload failed');
      }

      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Complete upload flow
  static async uploadFile(
    fileUri: string,
    fileName: string,
    fileType: string,
    fileSize: number,
    onProgress?: (progress: number) => void
  ): Promise<UploadedFile> {
    try {
      // Step 1: Request presigned URL
      const { uploadUrl, fileUrl, fileId } = await this.requestPresignedUrl(
        fileName,
        fileType,
        fileSize
      );

      // Step 2: Upload file
      await this.uploadWithPresignedUrl(fileUri, uploadUrl, fileType, onProgress);

      // Step 3: Return uploaded file info
      return {
        id: fileId,
        fileName,
        fileUrl,
        fileType,
        fileSize,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in upload flow:', error);
      throw error;
    }
  }

  // Pick document
  static async pickDocument(): Promise<DocumentPicker.DocumentPickerResult> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      return result;
    } catch (error) {
      console.error('Error picking document:', error);
      throw error;
    }
  }

  // Pick image from gallery
  static async pickImage(): Promise<ImagePicker.ImagePickerResult> {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permission.granted) {
        throw new Error('Permission to access gallery denied');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        exif: false,
      });

      return result;
    } catch (error) {
      console.error('Error picking image:', error);
      throw error;
    }
  }

  // Take photo with camera
  static async takePhoto(): Promise<ImagePicker.ImagePickerResult> {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permission.granted) {
        throw new Error('Permission to access camera denied');
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        exif: false,
      });

      return result;
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error;
    }
  }

  // Pick multiple images
  static async pickMultipleImages(): Promise<ImagePicker.ImagePickerResult> {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permission.granted) {
        throw new Error('Permission to access gallery denied');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        exif: false,
      });

      return result;
    } catch (error) {
      console.error('Error picking multiple images:', error);
      throw error;
    }
  }

  // Get file info
  static async getFileInfo(uri: string): Promise<FileSystem.FileInfo> {
    try {
      return await FileSystem.getInfoAsync(uri);
    } catch (error) {
      console.error('Error getting file info:', error);
      throw error;
    }
  }

  // Get file extension
  static getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  // Get file type category
  static getFileTypeCategory(fileName: string): 'image' | 'video' | 'pdf' | 'doc' | 'other' {
    const ext = this.getFileExtension(fileName);
    
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
    const pdfExts = ['pdf'];
    const docExts = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];

    if (imageExts.includes(ext)) return 'image';
    if (videoExts.includes(ext)) return 'video';
    if (pdfExts.includes(ext)) return 'pdf';
    if (docExts.includes(ext)) return 'doc';
    return 'other';
  }

  // Format file size
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Download file
  static async downloadFile(
    url: string,
    fileName: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const fileUri = FileSystem.documentDirectory + fileName;

      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        fileUri,
        {},
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          onProgress?.(progress);
        }
      );

      const result = await downloadResumable.downloadAsync();
      
      if (!result) {
        throw new Error('Download failed');
      }

      return result.uri;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  // Delete file from local storage
  static async deleteLocalFile(uri: string): Promise<void> {
    try {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}

export default FileUploadService;
