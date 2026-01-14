/**
 * HOS - Hospital Management System
 * Domain Events System
 * ===========================================
 * Event-driven architecture for workflow automation
 */

import { prisma } from '@/lib/db';
import { EventStatus } from '@prisma/client';

/**
 * Event types enumeration
 */
export enum EventType {
  // Patient Events
  PATIENT_REGISTERED = 'PatientRegistered',
  PATIENT_UPDATED = 'PatientUpdated',
  
  // Appointment Events
  APPOINTMENT_BOOKED = 'AppointmentBooked',
  APPOINTMENT_CONFIRMED = 'AppointmentConfirmed',
  APPOINTMENT_CANCELLED = 'AppointmentCancelled',
  APPOINTMENT_RESCHEDULED = 'AppointmentRescheduled',
  APPOINTMENT_COMPLETED = 'AppointmentCompleted',
  APPOINTMENT_NO_SHOW = 'AppointmentNoShow',
  
  // Encounter Events
  ENCOUNTER_STARTED = 'EncounterStarted',
  ENCOUNTER_COMPLETED = 'EncounterCompleted',
  
  // Clinical Events
  VITALS_RECORDED = 'VitalsRecorded',
  DIAGNOSIS_ADDED = 'DiagnosisAdded',
  PRESCRIPTION_ISSUED = 'PrescriptionIssued',
  PRESCRIPTION_DISPENSED = 'PrescriptionDispensed',
  
  // Lab Events
  LAB_ORDER_CREATED = 'LabOrderCreated',
  SAMPLE_COLLECTED = 'SampleCollected',
  LAB_PROCESSING = 'LabProcessing',
  LAB_RESULT_READY = 'LabResultReady',
  LAB_REPORT_VALIDATED = 'LabReportValidated',
  LAB_REPORT_PUBLISHED = 'LabReportPublished',
  
  // IPD Events
  PATIENT_ADMITTED = 'PatientAdmitted',
  BED_ASSIGNED = 'BedAssigned',
  PATIENT_TRANSFERRED = 'PatientTransferred',
  PATIENT_DISCHARGED = 'PatientDischarged',
  
  // Billing Events
  INVOICE_CREATED = 'InvoiceCreated',
  PAYMENT_RECEIVED = 'PaymentReceived',
  INVOICE_OVERDUE = 'InvoiceOverdue',
  
  // HR Events
  EMPLOYEE_JOINED = 'EmployeeJoined',
  SHIFT_STARTED = 'ShiftStarted',
  SHIFT_ENDED = 'ShiftEnded',
  LEAVE_REQUESTED = 'LeaveRequested',
  LEAVE_APPROVED = 'LeaveApproved',
  
  // Inventory Events
  STOCK_LOW = 'StockLow',
  STOCK_EXPIRING = 'StockExpiring',
  STOCK_REPLENISHED = 'StockReplenished',
  
  // Marketing Events
  CAMPAIGN_STARTED = 'CampaignStarted',
  FEEDBACK_SUBMITTED = 'FeedbackSubmitted',
  FOLLOW_UP_DUE = 'FollowUpDue',
  
  // AI Events
  AI_RISK_DETECTED = 'AIRiskDetected',
  AI_ABNORMAL_RESULT = 'AIAbnormalResult',
}

/**
 * Event payload interface
 */
export interface EventPayload {
  [key: string]: unknown;
}

/**
 * Publish domain event
 */
export async function publishEvent(
  tenantId: string,
  actorId: string | null,
  entityType: string,
  entityId: string,
  eventType: EventType | string,
  payload: EventPayload
): Promise<void> {
  try {
    await prisma.domainEvent.create({
      data: {
        tenantId,
        actorId,
        entityType,
        entityId,
        eventType,
        payload,
        status: EventStatus.PENDING,
      },
    });

    // Process event asynchronously (in production, use message queue)
    processEvent(entityType, entityId, eventType, payload).catch(console.error);
  } catch (error) {
    console.error('Failed to publish event:', error);
  }
}

/**
 * Process domain event (trigger automations)
 */
async function processEvent(
  entityType: string,
  entityId: string,
  eventType: EventType | string,
  payload: EventPayload
): Promise<void> {
  // Get event handlers for this event type
  const handlers = EVENT_HANDLERS[eventType] || [];

  for (const handler of handlers) {
    try {
      await handler(entityType, entityId, payload);
    } catch (error) {
      console.error(`Event handler failed for ${eventType}:`, error);
    }
  }

  // Mark event as processed
  await prisma.domainEvent.updateMany({
    where: {
      entityType,
      entityId,
      eventType,
      status: EventStatus.PENDING,
    },
    data: {
      status: EventStatus.PROCESSED,
      processedAt: new Date(),
    },
  });
}

/**
 * Event handler type
 */
type EventHandler = (
  entityType: string,
  entityId: string,
  payload: EventPayload
) => Promise<void>;

/**
 * Event handlers registry
 */
const EVENT_HANDLERS: Record<string, EventHandler[]> = {
  // Appointment booked -> Send confirmation notification
  [EventType.APPOINTMENT_BOOKED]: [
    async (entityType, entityId, payload) => {
      console.log(`[Event] Appointment ${entityId} booked - Sending confirmation...`);
      // In production: Send SMS/Email notification
      await createNotification(
        payload.tenantId as string,
        payload.patientUserId as string,
        'Appointment Confirmed',
        `Your appointment has been scheduled for ${payload.scheduledAt}`,
        'APPOINTMENT'
      );
    },
  ],

  // Lab report published -> Notify patient
  [EventType.LAB_REPORT_PUBLISHED]: [
    async (entityType, entityId, payload) => {
      console.log(`[Event] Lab report ${entityId} published - Notifying patient...`);
      await createNotification(
        payload.tenantId as string,
        payload.patientUserId as string,
        'Lab Report Ready',
        `Your lab report for ${payload.testName} is now available.`,
        'LAB_RESULT'
      );
    },
  ],

  // Stock low -> Alert inventory manager
  [EventType.STOCK_LOW]: [
    async (entityType, entityId, payload) => {
      console.log(`[Event] Stock low for ${payload.itemName} - Creating alert...`);
      // In production: Notify inventory manager
    },
  ],

  // AI risk detected -> Alert doctor
  [EventType.AI_RISK_DETECTED]: [
    async (entityType, entityId, payload) => {
      console.log(`[Event] AI detected risk - Alerting doctor...`);
      await createNotification(
        payload.tenantId as string,
        payload.doctorUserId as string,
        'Clinical Risk Alert',
        `AI has detected a potential risk for patient. Please review.`,
        'SYSTEM'
      );
    },
  ],

  // Follow-up due -> Remind patient
  [EventType.FOLLOW_UP_DUE]: [
    async (entityType, entityId, payload) => {
      console.log(`[Event] Follow-up due for patient - Sending reminder...`);
      await createNotification(
        payload.tenantId as string,
        payload.patientUserId as string,
        'Follow-up Reminder',
        `Your follow-up appointment is due. Please book your next visit.`,
        'APPOINTMENT'
      );
    },
  ],
};

/**
 * Create notification helper
 */
async function createNotification(
  tenantId: string,
  userId: string,
  title: string,
  message: string,
  type: string
): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        tenantId,
        userId,
        title,
        message,
        type,
        status: 'PENDING',
      },
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

/**
 * Register custom event handler
 */
export function registerEventHandler(
  eventType: EventType | string,
  handler: EventHandler
): void {
  if (!EVENT_HANDLERS[eventType]) {
    EVENT_HANDLERS[eventType] = [];
  }
  EVENT_HANDLERS[eventType].push(handler);
}

/**
 * Get pending events for processing
 */
export async function getPendingEvents(limit: number = 100) {
  return prisma.domainEvent.findMany({
    where: {
      status: EventStatus.PENDING,
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: limit,
  });
}

/**
 * Retry failed events
 */
export async function retryFailedEvents(): Promise<number> {
  const failedEvents = await prisma.domainEvent.findMany({
    where: {
      status: EventStatus.FAILED,
      retryCount: { lt: 3 },
    },
    take: 50,
  });

  let retried = 0;

  for (const event of failedEvents) {
    try {
      await prisma.domainEvent.update({
        where: { id: event.id },
        data: {
          status: EventStatus.RETRYING,
          retryCount: { increment: 1 },
        },
      });

      await processEvent(
        event.entityType,
        event.entityId,
        event.eventType,
        event.payload as EventPayload
      );

      retried++;
    } catch (error) {
      console.error(`Failed to retry event ${event.id}:`, error);
      await prisma.domainEvent.update({
        where: { id: event.id },
        data: {
          status: EventStatus.FAILED,
          error: String(error),
        },
      });
    }
  }

  return retried;
}

export default {
  publishEvent,
  registerEventHandler,
  getPendingEvents,
  retryFailedEvents,
  EventType,
};
