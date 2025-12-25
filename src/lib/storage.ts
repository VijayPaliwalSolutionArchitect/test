/**
 * ===========================================
 * FILE STORAGE SERVICE (LOCAL + CLOUD)
 * ===========================================
 * 
 * Configurable file storage that supports:
 * 1. LOCAL MODE: Saves files to public/uploads folder
 * 2. CLOUD MODE: Uploads to Uploadthing or Vercel Blob
 * 
 * HOW TO SWITCH TO CLOUD STORAGE:
 * 1. Set STORAGE_MODE="cloud" in .env
 * 2. Configure Uploadthing or Vercel Blob credentials
 * 3. Restart the application
 */

import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  filename?: string
  size?: number
  mimeType?: string
}

export interface StorageConfig {
  mode: 'local' | 'cloud'
  localPath: string
  maxFileSize: number // in bytes
  allowedTypes: string[]
}

// Default configuration
const defaultConfig: StorageConfig = {
  mode: (process.env.STORAGE_MODE as 'local' | 'cloud') || 'local',
  localPath: process.env.LOCAL_STORAGE_PATH || '/uploads',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf',
    'video/mp4',
    'video/webm',
  ],
}

/**
 * Generate unique filename with original extension
 */
function generateFilename(originalName: string): string {
  const ext = path.extname(originalName)
  const uuid = uuidv4()
  const timestamp = Date.now()
  return `${timestamp}-${uuid}${ext}`
}

/**
 * Validate file before upload
 */
function validateFile(
  file: File | Buffer,
  mimeType: string,
  config: StorageConfig
): { valid: boolean; error?: string } {
  // Check file size
  const size = file instanceof File ? file.size : file.length
  if (size > config.maxFileSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed (${config.maxFileSize / 1024 / 1024}MB)`,
    }
  }
  
  // Check mime type
  if (!config.allowedTypes.includes(mimeType)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${config.allowedTypes.join(', ')}`,
    }
  }
  
  return { valid: true }
}

/**
 * Upload file to local storage
 */
async function uploadToLocal(
  buffer: Buffer,
  filename: string,
  subfolder: string = ''
): Promise<UploadResult> {
  try {
    const uploadDir = path.join(
      process.cwd(),
      'public',
      defaultConfig.localPath,
      subfolder
    )
    
    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true })
    
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)
    
    // Return public URL
    const url = path.join(defaultConfig.localPath, subfolder, filename).replace(/\\/g, '/')
    
    return {
      success: true,
      url,
      filename,
      size: buffer.length,
    }
  } catch (error) {
    console.error('[Storage] Local upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

/**
 * Upload file to cloud storage (Uploadthing/Vercel Blob)
 * 
 * TO IMPLEMENT CLOUD UPLOAD:
 * 1. Install @uploadthing/react or @vercel/blob
 * 2. Configure credentials in .env
 * 3. Uncomment and modify the code below
 */
async function uploadToCloud(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<UploadResult> {
  // ===========================================
  // UPLOADTHING IMPLEMENTATION (uncomment when ready)
  // ===========================================
  /*
  const { utapi } = require('uploadthing/server')
  
  const file = new File([buffer], filename, { type: mimeType })
  const response = await utapi.uploadFiles([file])
  
  if (response[0].error) {
    return { success: false, error: response[0].error.message }
  }
  
  return {
    success: true,
    url: response[0].data.url,
    filename,
    size: buffer.length,
    mimeType,
  }
  */
  
  // ===========================================
  // VERCEL BLOB IMPLEMENTATION (uncomment when ready)
  // ===========================================
  /*
  const { put } = require('@vercel/blob')
  
  const blob = await put(filename, buffer, {
    access: 'public',
    contentType: mimeType,
  })
  
  return {
    success: true,
    url: blob.url,
    filename,
    size: buffer.length,
    mimeType,
  }
  */
  
  // Fallback to local if cloud not configured
  console.warn('[Storage] Cloud mode not configured, falling back to local')
  return uploadToLocal(buffer, filename)
}

/**
 * Main upload function - automatically routes to local or cloud
 */
export async function uploadFile(
  file: File | Buffer,
  options: {
    filename?: string
    mimeType?: string
    subfolder?: string
    config?: Partial<StorageConfig>
  } = {}
): Promise<UploadResult> {
  const config = { ...defaultConfig, ...options.config }
  
  // Get file data
  let buffer: Buffer
  let mimeType: string
  let originalName: string
  
  if (file instanceof File) {
    buffer = Buffer.from(await file.arrayBuffer())
    mimeType = file.type
    originalName = file.name
  } else {
    buffer = file
    mimeType = options.mimeType || 'application/octet-stream'
    originalName = options.filename || 'file'
  }
  
  // Validate
  const validation = validateFile(buffer, mimeType, config)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }
  
  // Generate unique filename
  const filename = generateFilename(originalName)
  
  // Upload based on mode
  if (config.mode === 'cloud') {
    return uploadToCloud(buffer, filename, mimeType)
  }
  
  return uploadToLocal(buffer, filename, options.subfolder)
}

/**
 * Delete file from storage
 */
export async function deleteFile(url: string): Promise<boolean> {
  try {
    if (defaultConfig.mode === 'local') {
      const filepath = path.join(process.cwd(), 'public', url)
      await unlink(filepath)
      return true
    }
    
    // For cloud storage, implement deletion based on provider
    // Uploadthing: utapi.deleteFiles([fileKey])
    // Vercel Blob: del(url)
    
    console.warn('[Storage] Cloud file deletion not implemented')
    return false
  } catch (error) {
    console.error('[Storage] Delete error:', error)
    return false
  }
}

/**
 * Get storage configuration (for admin panel)
 */
export function getStorageConfig(): StorageConfig {
  return { ...defaultConfig }
}

/**
 * Update storage mode (for admin panel)
 */
export function setStorageMode(mode: 'local' | 'cloud'): void {
  defaultConfig.mode = mode
}

export default {
  uploadFile,
  deleteFile,
  getStorageConfig,
  setStorageMode,
}
