/**
 * Sync Service - Handles offline/online data synchronization
 */

import NetInfo from '@react-native-community/netinfo';
import { RealmService } from './RealmService';
import { store } from '@/store';
import { setOnlineStatus, startSync, endSync } from '@/store/slices/offlineSlice';

export class SyncService {
  private static syncInterval: NodeJS.Timeout | null = null;
  private static isOnline = true;

  // Initialize sync service
  static initialize(): void {
    // Monitor network status
    NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable !== false;
      this.isOnline = online;
      store.dispatch(setOnlineStatus(online));

      if (online) {
        console.log('Device is online - starting sync');
        this.syncNow();
      } else {
        console.log('Device is offline');
      }
    });

    // Start periodic sync (every 5 minutes when online)
    this.startPeriodicSync();
  }

  // Start periodic background sync
  private static startPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      if (this.isOnline) {
        this.syncNow();
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  // Perform sync now
  static async syncNow(): Promise<void> {
    if (!this.isOnline) {
      console.log('Cannot sync - device is offline');
      return;
    }

    try {
      store.dispatch(startSync());
      console.log('Starting sync...');

      // Get pending offline actions
      const pendingActions = RealmService.getPendingActions();

      if (pendingActions.length === 0) {
        console.log('No pending actions to sync');
        store.dispatch(endSync());
        return;
      }

      console.log(`Syncing ${pendingActions.length} pending actions`);

      // Process each action
      for (const action of pendingActions) {
        try {
          await this.processAction(action);
          RealmService.updateActionStatus(action._id, 'success');
        } catch (error) {
          console.error('Error processing action:', action, error);
          
          // Increment retry count
          const newRetryCount = action.retryCount + 1;
          
          if (newRetryCount >= 3) {
            // Max retries reached - mark as failed
            RealmService.updateActionStatus(action._id, 'failed', newRetryCount);
          } else {
            // Update retry count
            RealmService.updateActionStatus(action._id, 'pending', newRetryCount);
          }
        }
      }

      // Clean up successful actions
      RealmService.clearSuccessfulActions();

      console.log('Sync completed');
      store.dispatch(endSync());
    } catch (error) {
      console.error('Error during sync:', error);
      store.dispatch(endSync());
    }
  }

  // Process individual action
  private static async processAction(action: any): Promise<void> {
    const { type, payload } = action;

    switch (type) {
      case 'SUBMIT_ASSIGNMENT':
        await this.syncAssignmentSubmission(payload);
        break;
      
      case 'MARK_ATTENDANCE':
        await this.syncAttendance(payload);
        break;
      
      case 'SEND_MESSAGE':
        await this.syncMessage(payload);
        break;
      
      default:
        console.warn('Unknown action type:', type);
    }
  }

  // Sync assignment submission
  private static async syncAssignmentSubmission(payload: any): Promise<void> {
    // TODO: Call actual API
    console.log('Syncing assignment submission:', payload);
    // Example:
    // const response = await fetch('/assignments/submit', {
    //   method: 'POST',
    //   body: JSON.stringify(payload),
    // });
  }

  // Sync attendance
  private static async syncAttendance(payload: any): Promise<void> {
    console.log('Syncing attendance:', payload);
    // TODO: Call actual API
  }

  // Sync message
  private static async syncMessage(payload: any): Promise<void> {
    console.log('Syncing message:', payload);
    // TODO: Call actual API
  }

  // Check if device is online
  static isDeviceOnline(): boolean {
    return this.isOnline;
  }

  // Stop sync service
  static stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

export default SyncService;
