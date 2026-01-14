# AI Integration Guide

This guide covers enabling and configuring AI features in HOS Hospital Management System.

## Overview

HOS includes two main AI features:

1. **AI Clinical Copilot** - For doctors and clinical staff
2. **AI Health Assistant** - For patients

Both are powered by OpenAI's GPT-4 model with healthcare-specific guardrails.

## Prerequisites

- OpenAI API account with API key
- Sufficient API credits
- Production-ready: GPT-4 access (GPT-3.5 works but less accurate)

## Step 1: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create new secret key
5. Copy the key (starts with `sk-`)

## Step 2: Configure Environment

```env
# OpenAI Configuration
OPENAI_API_KEY="sk-your-api-key-here"
OPENAI_MODEL="gpt-4-turbo-preview"

# Enable AI Features
AI_ENABLED="true"
AI_CLINICAL_COPILOT_ENABLED="true"
AI_PATIENT_ASSISTANT_ENABLED="true"
```

## Step 3: Available AI Features

### AI Clinical Copilot (For Doctors)

**Purpose:** Assist doctors with clinical documentation and decision support.

**Capabilities:**
- Generate SOAP notes from conversation
- Suggest differential diagnoses
- Check drug-drug interactions
- Summarize patient history
- Provide medical literature references

**Guardrails:**
- Never provides final diagnoses
- Always requires physician confirmation
- Includes confidence levels
- Flags critical findings

**Usage in Code:**

```typescript
import { aiChat, generateClinicalSummary, checkDrugInteractions } from '@/lib/ai';

// Chat with AI Copilot
const response = await aiChat(
  'Summarize this patient\'s history',
  {
    role: 'DOCTOR',
    userId: 'doctor-id',
    tenantId: 'tenant-id',
    patientContext: {
      age: 45,
      gender: 'MALE',
      conditions: ['Diabetes', 'Hypertension'],
      allergies: ['Penicillin'],
    },
  }
);

// Generate clinical summary
const summary = await generateClinicalSummary(context, {
  chiefComplaint: 'Chest pain',
  vitals: { bp: '140/90', hr: '88' },
  notes: ['Patient reports...'],
  diagnoses: ['Suspected angina'],
  prescriptions: ['Aspirin 75mg'],
});

// Check drug interactions
const interactions = await checkDrugInteractions(
  context,
  ['Metformin 500mg', 'Aspirin 75mg'],
  'Warfarin 5mg'
);
```

### AI Health Assistant (For Patients)

**Purpose:** Help patients understand their health information.

**Capabilities:**
- Explain medical reports in simple terms
- Answer general health questions
- Provide appointment reminders
- Share wellness tips
- Guide through hospital services

**Guardrails:**
- Never provides diagnoses
- Always recommends professional consultation
- Uses simple, non-medical language
- Encourages doctor visits for symptoms

**Usage in Code:**

```typescript
import { aiChat, generatePatientEducation } from '@/lib/ai';

// Chat with Health Assistant
const response = await aiChat(
  'What does my HbA1c result mean?',
  {
    role: 'PATIENT',
    userId: 'patient-id',
    tenantId: 'tenant-id',
  }
);

// Generate educational content
const education = await generatePatientEducation(
  context,
  'Managing Type 2 Diabetes'
);
```

## Step 4: API Endpoints

### POST /api/ai/chat

General AI chat endpoint.

**Request:**
```json
{
  "message": "Your question here",
  "context": {
    "patientId": "optional-patient-id",
    "encounterId": "optional-encounter-id"
  },
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI response here",
  "suggestions": ["Follow-up option 1", "Follow-up option 2"],
  "confidence": 0.85,
  "disclaimer": "AI suggestions are for reference only.",
  "tokensUsed": 500,
  "latencyMs": 1200
}
```

### POST /api/ai/clinical-summary

Generate clinical summary for an encounter.

### POST /api/ai/drug-interactions

Check drug interactions.

## Step 5: Mock Mode (Without API Key)

If `OPENAI_API_KEY` is not set or invalid, the system automatically uses mock responses.

**Mock Features:**
- Predefined responses for common queries
- Role-specific mock content
- Useful for development and demos

**Force Mock Mode:**
```env
OPENAI_API_KEY="sk-mock-key"
```

## Step 6: Audit and Logging

All AI interactions are logged to the database:

```typescript
// AIInteraction model stores:
{
  tenantId: 'tenant-id',
  userId: 'user-id',
  role: 'DOCTOR',
  prompt: 'User query',
  response: 'AI response',
  promptHash: 'hash-for-dedup',
  responseHash: 'hash-for-cache',
  modelVersion: 'gpt-4-turbo-preview',
  latencyMs: 1200,
  tokensUsed: 500,
  wasOverridden: false,  // If doctor changed AI suggestion
}
```

## Step 7: Rate Limiting

Implement rate limiting to control costs:

```typescript
// In your API route
const rateLimiter = {
  DOCTOR: 50,     // 50 requests per hour
  PATIENT: 20,    // 20 requests per hour
};
```

## Step 8: Cost Optimization

### Token Usage

| Model | Input (1K tokens) | Output (1K tokens) |
|-------|-------------------|--------------------|
| GPT-4 Turbo | $0.01 | $0.03 |
| GPT-4 | $0.03 | $0.06 |
| GPT-3.5 Turbo | $0.0005 | $0.0015 |

### Optimization Strategies

1. **Prompt Caching:** Hash prompts and cache responses
2. **Batch Requests:** Combine similar queries
3. **Context Trimming:** Only send relevant context
4. **Model Selection:** Use GPT-3.5 for simple queries

## Step 9: Healthcare Compliance

### PHI Handling

- Patient data is anonymized in prompts when possible
- No PHI is stored in OpenAI servers (API doesn't train on data)
- All interactions are audit-logged locally

### Disclaimers

All AI responses include role-appropriate disclaimers:

- **Doctors:** "AI suggestions are for reference only. Clinical decisions must be made by qualified physicians."
- **Patients:** "This information is for educational purposes only. Please consult your healthcare provider for medical advice."

### Audit Trail

Every AI interaction is logged with:
- User ID and role
- Timestamp
- Prompt and response
- Model version
- Whether suggestions were overridden

## Troubleshooting

### API Key Invalid

```
Error: Invalid API key
```

**Solution:** Verify key at https://platform.openai.com/api-keys

### Rate Limit Exceeded

```
Error: Rate limit exceeded
```

**Solution:** Implement request queuing or upgrade OpenAI plan

### High Latency

**Solutions:**
1. Use GPT-3.5 for simple queries
2. Implement response caching
3. Reduce context size

### Response Quality Issues

**Solutions:**
1. Improve prompt engineering
2. Add more context
3. Use GPT-4 instead of GPT-3.5

## Best Practices

1. **Always validate AI suggestions** before acting
2. **Log all interactions** for compliance
3. **Implement rate limiting** to control costs
4. **Use mock mode** for development
5. **Monitor token usage** regularly
6. **Update system prompts** based on feedback
7. **Test with edge cases** before production
8. **Have fallback** for when AI is unavailable
