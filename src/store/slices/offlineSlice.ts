/**
 * Offline Slice - Manages offline queue and sync state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SyncStatus } from '@/types';

interface QueuedAction {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
  retryCount: number;
  error?: string;
}

interface OfflineState {
  queue: QueuedAction[];
  syncStatus: SyncStatus;
}

const initialState: OfflineState = {
  queue: [],
  syncStatus: {
    lastSyncAt: undefined,
    isSyncing: false,
    pendingItems: 0,
    failedItems: 0,
  },
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    addToQueue: (state, action: PayloadAction<Omit<QueuedAction, 'id' | 'timestamp' | 'retryCount'>>) => {
      const queuedAction: QueuedAction = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        retryCount: 0,
      };
      state.queue.push(queuedAction);
      state.syncStatus.pendingItems += 1;
    },
    
    removeFromQueue: (state, action: PayloadAction<string>) => {
      const index = state.queue.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.queue.splice(index, 1);
        state.syncStatus.pendingItems = Math.max(0, state.syncStatus.pendingItems - 1);
      }
    },
    
    updateQueueItem: (state, action: PayloadAction<{ id: string; updates: Partial<QueuedAction> }>) => {
      const item = state.queue.find(i => i.id === action.payload.id);
      if (item) {
        Object.assign(item, action.payload.updates);
      }
    },
    
    incrementRetryCount: (state, action: PayloadAction<string>) => {
      const item = state.queue.find(i => i.id === action.payload);
      if (item) {
        item.retryCount += 1;
      }
    },
    
    markItemAsFailed: (state, action: PayloadAction<{ id: string; error: string }>) => {
      const item = state.queue.find(i => i.id === action.payload.id);
      if (item) {
        item.error = action.payload.error;
        state.syncStatus.failedItems += 1;
      }
    },
    
    clearQueue: (state) => {
      state.queue = [];
      state.syncStatus.pendingItems = 0;
      state.syncStatus.failedItems = 0;
    },
    
    setSyncStatus: (state, action: PayloadAction<Partial<SyncStatus>>) => {
      state.syncStatus = { ...state.syncStatus, ...action.payload };
    },
    
    startSync: (state) => {
      state.syncStatus.isSyncing = true;
    },
    
    endSync: (state) => {
      state.syncStatus.isSyncing = false;
      state.syncStatus.lastSyncAt = new Date().toISOString();
    },
  },
});

export const {
  addToQueue,
  removeFromQueue,
  updateQueueItem,
  incrementRetryCount,
  markItemAsFailed,
  clearQueue,
  setSyncStatus,
  startSync,
  endSync,
} = offlineSlice.actions;

export default offlineSlice.reducer;
