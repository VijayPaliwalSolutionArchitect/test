/**
 * Realm Service - Offline database for critical data
 */

import Realm from 'realm';

// Define Realm schemas
class TimetableEntrySchema extends Realm.Object<TimetableEntrySchema> {
  _id!: string;
  classId!: string;
  subjectName!: string;
  teacherName!: string;
  dayOfWeek!: number;
  startTime!: string;
  endTime!: string;
  room?: string;
  syncedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'TimetableEntry',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      classId: 'string',
      subjectName: 'string',
      teacherName: 'string',
      dayOfWeek: 'int',
      startTime: 'string',
      endTime: 'string',
      room: 'string?',
      syncedAt: 'date',
    },
  };
}

class AssignmentSchema extends Realm.Object<AssignmentSchema> {
  _id!: string;
  title!: string;
  description!: string;
  dueDate!: Date;
  classId!: string;
  subjectName!: string;
  status!: string;
  syncedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Assignment',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      title: 'string',
      description: 'string',
      dueDate: 'date',
      classId: 'string',
      subjectName: 'string',
      status: 'string',
      syncedAt: 'date',
    },
  };
}

class AttendanceRecordSchema extends Realm.Object<AttendanceRecordSchema> {
  _id!: string;
  studentId!: string;
  studentName!: string;
  status!: string;
  date!: Date;
  classId!: string;
  syncedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'AttendanceRecord',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      studentId: 'string',
      studentName: 'string',
      status: 'string',
      date: 'date',
      classId: 'string',
      syncedAt: 'date',
    },
  };
}

class OfflineActionSchema extends Realm.Object<OfflineActionSchema> {
  _id!: string;
  type!: string;
  payload!: string; // JSON string
  timestamp!: Date;
  retryCount!: number;
  status!: string; // 'pending', 'success', 'failed'

  static schema: Realm.ObjectSchema = {
    name: 'OfflineAction',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      type: 'string',
      payload: 'string',
      timestamp: 'date',
      retryCount: 'int',
      status: 'string',
    },
  };
}

export class RealmService {
  private static instance: Realm | null = null;

  // Initialize Realm database
  static async initialize(): Promise<Realm> {
    if (this.instance) {
      return this.instance;
    }

    try {
      this.instance = await Realm.open({
        schema: [
          TimetableEntrySchema,
          AssignmentSchema,
          AttendanceRecordSchema,
          OfflineActionSchema,
        ],
        schemaVersion: 1,
        migration: (oldRealm, newRealm) => {
          // Handle schema migrations here if needed
        },
      });

      console.log('Realm database initialized');
      return this.instance;
    } catch (error) {
      console.error('Error initializing Realm:', error);
      throw error;
    }
  }

  // Get Realm instance
  static getInstance(): Realm {
    if (!this.instance) {
      throw new Error('Realm not initialized. Call initialize() first.');
    }
    return this.instance;
  }

  // ===== Timetable Operations =====

  static saveTimetableEntries(entries: any[]): void {
    const realm = this.getInstance();
    realm.write(() => {
      entries.forEach(entry => {
        realm.create(
          'TimetableEntry',
          {
            ...entry,
            _id: entry.id,
            syncedAt: new Date(),
          },
          Realm.UpdateMode.Modified
        );
      });
    });
  }

  static getTimetableEntries(classId: string): any[] {
    const realm = this.getInstance();
    const entries = realm.objects('TimetableEntry').filtered('classId = $0', classId);
    return Array.from(entries);
  }

  // ===== Assignment Operations =====

  static saveAssignments(assignments: any[]): void {
    const realm = this.getInstance();
    realm.write(() => {
      assignments.forEach(assignment => {
        realm.create(
          'Assignment',
          {
            ...assignment,
            _id: assignment.id,
            dueDate: new Date(assignment.dueDate),
            syncedAt: new Date(),
          },
          Realm.UpdateMode.Modified
        );
      });
    });
  }

  static getAssignments(classId: string, status?: string): any[] {
    const realm = this.getInstance();
    let query = 'classId = $0';
    const params: any[] = [classId];

    if (status) {
      query += ' AND status = $1';
      params.push(status);
    }

    const assignments = realm.objects('Assignment').filtered(query, ...params);
    return Array.from(assignments);
  }

  // ===== Attendance Operations =====

  static saveAttendanceRecords(records: any[]): void {
    const realm = this.getInstance();
    realm.write(() => {
      records.forEach(record => {
        realm.create(
          'AttendanceRecord',
          {
            ...record,
            _id: record.id,
            date: new Date(record.date),
            syncedAt: new Date(),
          },
          Realm.UpdateMode.Modified
        );
      });
    });
  }

  static getAttendanceRecords(studentId: string, from?: Date, to?: Date): any[] {
    const realm = this.getInstance();
    let query = 'studentId = $0';
    const params: any[] = [studentId];

    if (from) {
      query += ' AND date >= $1';
      params.push(from);
    }

    if (to) {
      query += ' AND date <= $2';
      params.push(to);
    }

    const records = realm.objects('AttendanceRecord').filtered(query, ...params);
    return Array.from(records);
  }

  // ===== Offline Action Queue =====

  static addOfflineAction(type: string, payload: any): void {
    const realm = this.getInstance();
    realm.write(() => {
      realm.create('OfflineAction', {
        _id: Date.now().toString(),
        type,
        payload: JSON.stringify(payload),
        timestamp: new Date(),
        retryCount: 0,
        status: 'pending',
      });
    });
  }

  static getPendingActions(): any[] {
    const realm = this.getInstance();
    const actions = realm.objects('OfflineAction').filtered('status = "pending"');
    return Array.from(actions).map(action => ({
      ...action,
      payload: JSON.parse(action.payload as any),
    }));
  }

  static updateActionStatus(id: string, status: string, retryCount?: number): void {
    const realm = this.getInstance();
    realm.write(() => {
      const action = realm.objectForPrimaryKey('OfflineAction', id);
      if (action) {
        (action as any).status = status;
        if (retryCount !== undefined) {
          (action as any).retryCount = retryCount;
        }
      }
    });
  }

  static clearSuccessfulActions(): void {
    const realm = this.getInstance();
    realm.write(() => {
      const actions = realm.objects('OfflineAction').filtered('status = "success"');
      realm.delete(actions);
    });
  }

  // ===== General Operations =====

  static clearAll(): void {
    const realm = this.getInstance();
    realm.write(() => {
      realm.deleteAll();
    });
  }

  static close(): void {
    if (this.instance && !this.instance.isClosed) {
      this.instance.close();
      this.instance = null;
    }
  }
}

export default RealmService;
