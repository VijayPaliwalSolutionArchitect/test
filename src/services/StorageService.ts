/**
 * Storage Service - Secure storage for tokens and app data
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';
import type { AuthTokens, AppSettings } from '@/types';

// Initialize MMKV for fast synchronous storage
const storage = new MMKV();

// Keys for secure storage
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_EXPIRY: 'token_expiry',
  USER_DATA: 'user_data',
  APP_SETTINGS: 'app_settings',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

export class StorageService {
  // ========== Secure Token Storage (Keychain/Keystore) ==========
  
  static async setTokens(tokens: AuthTokens): Promise<void> {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
      await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      await SecureStore.setItemAsync(
        STORAGE_KEYS.TOKEN_EXPIRY,
        (Date.now() + tokens.expiresIn * 1000).toString()
      );
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  }

  static async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  static async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  static async getTokenExpiry(): Promise<number | null> {
    try {
      const expiry = await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN_EXPIRY);
      return expiry ? parseInt(expiry, 10) : null;
    } catch (error) {
      console.error('Error getting token expiry:', error);
      return null;
    }
  }

  static async isTokenExpired(): Promise<boolean> {
    const expiry = await this.getTokenExpiry();
    if (!expiry) return true;
    return Date.now() >= expiry;
  }

  static async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN_EXPIRY);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  // ========== User Data (AsyncStorage for large data) ==========
  
  static async setUserData(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  static async getUserData(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  static async clearUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }

  // ========== App Settings (MMKV for fast sync access) ==========
  
  static setSettings(settings: AppSettings): void {
    try {
      storage.set(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  static getSettings(): AppSettings | null {
    try {
      const data = storage.getString(STORAGE_KEYS.APP_SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  }

  static setLanguage(language: 'en' | 'hi' | 'gu'): void {
    storage.set(STORAGE_KEYS.LANGUAGE, language);
  }

  static getLanguage(): 'en' | 'hi' | 'gu' {
    return (storage.getString(STORAGE_KEYS.LANGUAGE) as any) || 'en';
  }

  static setTheme(theme: 'light' | 'dark' | 'auto'): void {
    storage.set(STORAGE_KEYS.THEME, theme);
  }

  static getTheme(): 'light' | 'dark' | 'auto' {
    return (storage.getString(STORAGE_KEYS.THEME) as any) || 'light';
  }

  static setBiometricEnabled(enabled: boolean): void {
    storage.set(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled);
  }

  static getBiometricEnabled(): boolean {
    return storage.getBoolean(STORAGE_KEYS.BIOMETRIC_ENABLED) || false;
  }

  // ========== Generic MMKV Methods ==========
  
  static set(key: string, value: any): void {
    if (typeof value === 'object') {
      storage.set(key, JSON.stringify(value));
    } else if (typeof value === 'boolean') {
      storage.set(key, value);
    } else if (typeof value === 'number') {
      storage.set(key, value);
    } else {
      storage.set(key, String(value));
    }
  }

  static get(key: string): any {
    const value = storage.getString(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  static getBoolean(key: string): boolean {
    return storage.getBoolean(key) || false;
  }

  static getNumber(key: string): number {
    return storage.getNumber(key) || 0;
  }

  static getString(key: string): string | null {
    return storage.getString(key) || null;
  }

  static delete(key: string): void {
    storage.delete(key);
  }

  static clearAll(): void {
    storage.clearAll();
  }

  // ========== Offline Data Cache ==========
  
  static setCacheItem(key: string, data: any, ttl?: number): void {
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl: ttl || null,
    };
    storage.set(`cache_${key}`, JSON.stringify(cacheData));
  }

  static getCacheItem(key: string): any | null {
    try {
      const cached = storage.getString(`cache_${key}`);
      if (!cached) return null;

      const { data, timestamp, ttl } = JSON.parse(cached);
      
      // Check if cache is expired
      if (ttl && Date.now() - timestamp > ttl) {
        storage.delete(`cache_${key}`);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting cache item:', error);
      return null;
    }
  }

  static deleteCacheItem(key: string): void {
    storage.delete(`cache_${key}`);
  }

  static clearCache(): void {
    const keys = storage.getAllKeys();
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        storage.delete(key);
      }
    });
  }
}

export default StorageService;
