# API Documentation

Complete API reference for HOS Hospital Management System.

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

## Authentication

All endpoints (except `/auth/*`) require authentication via JWT token in cookies.

### Login

```
POST /api/auth/login
```

**Request:**
```json
{
  "email": "admin@hos.com",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "admin@hos.com",
    "name": "Admin",
    "role": "ADMIN"
  },
  "redirectUrl": "/admin/dashboard"
}
```

### Register (Patients Only)

```
POST /api/auth/register
```

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecurePass@123"
}
```

### Logout

```
POST /api/auth/logout
```

### Get Current User

```
GET /api/auth/me
```

---

## Patients

### List Patients

```
GET /api/patients
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| pageSize | number | Items per page (default: 20) |
| search | string | Search by name, MRN, phone |
| gender | string | Filter by gender |
| sortField | string | Sort field |
| sortOrder | string | asc or desc |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "mrn": "MRN000001",
      "fullName": "Rahul Verma",
      "gender": "MALE",
      "dob": "1990-05-15",
      "phone": "9876543210",
      "email": "rahul@example.com",
      "bloodGroup": "O+",
      "allergies": ["Penicillin"],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "totalPages": 5
}
```

### Get Patient by ID

```
GET /api/patients/:id
```

### Create Patient

```
POST /api/patients
```

**Request:**
```json
{
  "fullName": "John Doe",
  "gender": "MALE",
  "dob": "1990-05-15",
  "phone": "9876543210",
  "email": "john@example.com",
  "address": "123 Main St",
  "bloodGroup": "O+",
  "allergies": ["Penicillin"],
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "9876543211",
    "relation": "Spouse"
  }
}
```

### Update Patient

```
PUT /api/patients/:id
```

### Delete Patient (Soft Delete)

```
DELETE /api/patients/:id
```

---

## Appointments

### List Appointments

```
GET /api/appointments
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status |
| doctorId | string | Filter by doctor |
| patientId | string | Filter by patient |
| startDate | string | From date (ISO format) |
| endDate | string | To date (ISO format) |
| type | string | OPD, IPD, TELECONSULT |

### Create Appointment

```
POST /api/appointments
```

**Request:**
```json
{
  "patientId": "uuid",
  "doctorId": "uuid",
  "departmentId": "uuid",
  "scheduledAt": "2024-08-20T10:30:00Z",
  "duration": 15,
  "type": "OPD",
  "reason": "Follow-up consultation",
  "notes": "Patient requested morning slot"
}
```

### Update Appointment Status

```
PATCH /api/appointments/:id/status
```

**Request:**
```json
{
  "status": "CHECKED_IN"
}
```

### Cancel Appointment

```
POST /api/appointments/:id/cancel
```

**Request:**
```json
{
  "reason": "Patient requested cancellation"
}
```

### Reschedule Appointment

```
POST /api/appointments/:id/reschedule
```

**Request:**
```json
{
  "scheduledAt": "2024-08-21T14:00:00Z",
  "reason": "Doctor unavailable"
}
```

---

## Encounters

### List Encounters

```
GET /api/encounters
```

### Get Encounter Details

```
GET /api/encounters/:id
```

Includes: vitals, clinical notes, diagnoses, prescriptions, orders

### Start Encounter

```
POST /api/encounters
```

**Request:**
```json
{
  "patientId": "uuid",
  "doctorId": "uuid",
  "type": "OPD",
  "chiefComplaint": "Fever and headache for 3 days"
}
```

### Record Vitals

```
POST /api/encounters/:id/vitals
```

**Request:**
```json
{
  "bp": "120/80",
  "heartRate": "78",
  "temperature": "98.6",
  "spo2": "98",
  "weight": "72",
  "height": "175"
}
```

### Add Clinical Note

```
POST /api/encounters/:id/notes
```

**Request:**
```json
{
  "noteType": "SUBJECTIVE",
  "content": "Patient reports fever for 3 days..."
}
```

### Add Diagnosis

```
POST /api/encounters/:id/diagnoses
```

**Request:**
```json
{
  "icdCode": "J06.9",
  "description": "Acute upper respiratory infection",
  "isPrimary": true,
  "notes": "Likely viral etiology"
}
```

### Add Prescription

```
POST /api/encounters/:id/prescriptions
```

**Request:**
```json
{
  "medication": "Paracetamol 500mg",
  "dosage": "1 tablet",
  "frequency": "1-0-1",
  "duration": "5 days",
  "instructions": "Take after food"
}
```

### Complete Encounter

```
POST /api/encounters/:id/complete
```

---

## Lab Orders

### Create Lab Order

```
POST /api/lab/orders
```

**Request:**
```json
{
  "encounterId": "uuid",
  "testName": "Complete Blood Count",
  "testCode": "CBC001",
  "priority": "ROUTINE",
  "notes": "Fasting not required"
}
```

### Update Order Status

```
PATCH /api/lab/orders/:id/status
```

**Request:**
```json
{
  "status": "SAMPLE_COLLECTED"
}
```

### Submit Results

```
POST /api/lab/orders/:id/results
```

**Request:**
```json
{
  "result": {
    "hemoglobin": "14.2 g/dL",
    "wbc": "7500 /µL",
    "platelets": "250000 /µL"
  },
  "findings": "All parameters within normal limits",
  "isAbnormal": false
}
```

### Validate and Publish

```
POST /api/lab/orders/:id/publish
```

---

## Billing

### Create Invoice

```
POST /api/billing/invoices
```

**Request:**
```json
{
  "patientId": "uuid",
  "items": [
    {
      "description": "Consultation Fee",
      "category": "Consultation",
      "quantity": 1,
      "unitPrice": 500
    },
    {
      "description": "CBC Test",
      "category": "Lab",
      "quantity": 1,
      "unitPrice": 350
    }
  ],
  "discount": 5,
  "notes": "Insurance claim pending"
}
```

### Record Payment

```
POST /api/billing/payments
```

**Request:**
```json
{
  "invoiceId": "uuid",
  "amount": 850,
  "method": "CARD",
  "transactionId": "TXN123456"
}
```

---

## Inventory

### List Inventory Items

```
GET /api/inventory
```

### Add Stock

```
POST /api/inventory
```

### Update Stock

```
PUT /api/inventory/:id
```

### Low Stock Alert

```
GET /api/inventory/low-stock
```

### Expiring Items

```
GET /api/inventory/expiring
```

---

## HR & Payroll

### List Employees

```
GET /api/hr/employees
```

### Record Attendance

```
POST /api/hr/attendance
```

### Submit Leave Request

```
POST /api/hr/leaves
```

### Process Payroll

```
POST /api/hr/payroll/process
```

---

## AI

### Chat with AI

```
POST /api/ai/chat
```

**Request:**
```json
{
  "message": "What are the differential diagnoses for chest pain?",
  "context": {
    "patientId": "uuid",
    "encounterId": "uuid"
  },
  "sessionId": "session-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Based on the symptoms...",
  "suggestions": [
    "Order ECG",
    "Check troponin levels"
  ],
  "confidence": 0.85,
  "disclaimer": "AI suggestions are for reference only.",
  "tokensUsed": 500,
  "latencyMs": 1200
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": ["Validation error message"]
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Not authenticated |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid input |
| DUPLICATE | 409 | Resource already exists |
| SERVER_ERROR | 500 | Internal server error |

---

## Rate Limiting

- 100 requests per minute per user
- 429 Too Many Requests when exceeded

---

## Webhooks

### Event Types

- `patient.created`
- `appointment.booked`
- `appointment.cancelled`
- `encounter.completed`
- `lab.result.published`
- `payment.received`

### Webhook Payload

```json
{
  "event": "appointment.booked",
  "timestamp": "2024-08-15T10:30:00Z",
  "data": {
    "appointmentId": "uuid",
    "patientId": "uuid",
    "doctorId": "uuid",
    "scheduledAt": "2024-08-20T10:30:00Z"
  }
}
```
