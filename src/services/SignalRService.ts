/**
 * SignalR Service - Real-time communication
 */

import * as signalR from '@microsoft/signalr';
import { StorageService } from './StorageService';

const SIGNALR_URL = process.env.SIGNALR_HUB_URL || 'https://api.shivamitcs.in/hubs';

export class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private hubUrl: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, Set<Function>> = new Map();

  constructor(hubName: 'notifications' | 'messaging' | 'attendance') {
    this.hubUrl = `${SIGNALR_URL}/${hubName}`;
  }

  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR already connected');
      return;
    }

    try {
      const token = await StorageService.getAccessToken();

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.hubUrl, {
          accessTokenFactory: () => token || '',
          transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount >= this.maxReconnectAttempts) {
              return null; // Stop retrying
            }
            // Exponential backoff: 2s, 4s, 8s, 16s, 32s
            return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 32000);
          },
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Setup event handlers
      this.setupEventHandlers();

      await this.connection.start();
      console.log('SignalR connected successfully');
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error('SignalR connection error:', error);
      this.handleReconnect();
    }
  }

  private setupEventHandlers(): void {
    if (!this.connection) return;

    this.connection.onclose((error) => {
      console.log('SignalR connection closed', error);
      this.handleReconnect();
    });

    this.connection.onreconnecting((error) => {
      console.log('SignalR reconnecting...', error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log('SignalR reconnected', connectionId);
      this.reconnectAttempts = 0;
    });
  }

  private async handleReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 32000);
    
    console.log(`Attempting to reconnect in ${delay}ms... (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.listeners.clear();
      console.log('SignalR disconnected');
    }
  }

  on(eventName: string, callback: Function): void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
      
      // Register with SignalR
      this.connection?.on(eventName, (...args) => {
        const callbacks = this.listeners.get(eventName);
        callbacks?.forEach(cb => cb(...args));
      });
    }

    this.listeners.get(eventName)?.add(callback);
  }

  off(eventName: string, callback?: Function): void {
    if (!callback) {
      // Remove all listeners for this event
      this.connection?.off(eventName);
      this.listeners.delete(eventName);
    } else {
      // Remove specific listener
      this.listeners.get(eventName)?.delete(callback);
      
      // If no more listeners, unregister from SignalR
      if (this.listeners.get(eventName)?.size === 0) {
        this.connection?.off(eventName);
        this.listeners.delete(eventName);
      }
    }
  }

  async invoke(methodName: string, ...args: any[]): Promise<any> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR is not connected');
    }

    try {
      return await this.connection.invoke(methodName, ...args);
    } catch (error) {
      console.error(`SignalR invoke error (${methodName}):`, error);
      throw error;
    }
  }

  async send(methodName: string, ...args: any[]): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR is not connected');
    }

    try {
      await this.connection.send(methodName, ...args);
    } catch (error) {
      console.error(`SignalR send error (${methodName}):`, error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }
}

// Singleton instances for different hubs
export const notificationHub = new SignalRService('notifications');
export const messagingHub = new SignalRService('messaging');
export const attendanceHub = new SignalRService('attendance');

export default SignalRService;
