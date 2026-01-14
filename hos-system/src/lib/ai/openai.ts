/**
 * HOS - Hospital Management System
 * OpenAI Integration for AI Features
 * ===========================================
 * AI Clinical Copilot, Patient Assistant, Auto Documentation
 * Implements guardrails and audit logging for healthcare AI
 */

import OpenAI from 'openai';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/db';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-mock-key', // Will be replaced with real key
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
const AI_ENABLED = process.env.AI_ENABLED === 'true';

/**
 * AI Context interface for building prompts
 */
export interface AIContext {
  role: Role;
  userId: string;
  tenantId: string;
  patientContext?: {
    age?: number;
    gender?: string;
    conditions?: string[];
    allergies?: string[];
    currentMedications?: string[];
  };
  encounterContext?: {
    chiefComplaint?: string;
    vitals?: Record<string, string>;
    notes?: string[];
    diagnoses?: string[];
  };
  additionalContext?: Record<string, unknown>;
}

/**
 * AI Response interface
 */
export interface AIResponse {
  success: boolean;
  message: string;
  suggestions?: string[];
  confidence?: number;
  disclaimer?: string;
  tokensUsed?: number;
  latencyMs?: number;
}

/**
 * Role-specific system prompts
 */
const ROLE_SYSTEM_PROMPTS: Record<string, string> = {
  DOCTOR: `You are an AI Clinical Copilot for doctors in a hospital management system.
You assist with:
- Clinical documentation and SOAP notes
- Differential diagnosis suggestions (never final diagnosis)
- Drug interaction alerts
- Treatment plan suggestions
- Medical literature references

IMPORTANT GUARDRAILS:
- You SUGGEST, never DECIDE
- All suggestions require physician confirmation
- Never provide final diagnoses autonomously
- Always recommend specialist consultation for complex cases
- Flag any critical findings immediately
- Include confidence levels in your responses
- Cite sources when referencing medical literature`,

  NURSE: `You are an AI Nursing Assistant in a hospital management system.
You assist with:
- Vital sign interpretations
- Medication administration reminders
- Patient care documentation
- Handover report generation
- Early warning score calculations

IMPORTANT GUARDRAILS:
- Always defer clinical decisions to physicians
- Flag abnormal vitals for immediate attention
- Suggest nursing interventions within scope of practice
- Recommend physician notification for concerning findings`,

  PATIENT: `You are a friendly Health Assistant for patients in a hospital portal.
You help with:
- Understanding medical reports in simple terms
- General health education (not diagnosis)
- Appointment and medication reminders
- Answering questions about hospital services
- Wellness tips and preventive care guidance

IMPORTANT GUARDRAILS:
- NEVER provide diagnoses or treatment advice
- Always recommend consulting healthcare providers for medical concerns
- Use simple, non-medical language
- Encourage professional consultation for symptoms
- Do not interpret test results as normal/abnormal`,

  ADMIN: `You are an AI Administrative Assistant for hospital management.
You assist with:
- Operational insights and KPI analysis
- Resource utilization suggestions
- Workflow optimization recommendations
- Report generation and summarization
- Staff scheduling optimization

Focus on operational efficiency while maintaining patient care quality.`,

  DEFAULT: `You are an AI Assistant in a hospital management system.
Provide helpful, accurate information while always recommending professional medical consultation for health-related queries.
Never provide diagnoses or treatment decisions.`,
};

/**
 * Get system prompt based on user role
 */
function getSystemPrompt(role: Role): string {
  return ROLE_SYSTEM_PROMPTS[role] || ROLE_SYSTEM_PROMPTS.DEFAULT;
}

/**
 * Build context string for AI prompt
 */
function buildContextString(context: AIContext): string {
  const parts: string[] = [];

  if (context.patientContext) {
    const pc = context.patientContext;
    parts.push('PATIENT CONTEXT:');
    if (pc.age) parts.push(`- Age: ${pc.age} years`);
    if (pc.gender) parts.push(`- Gender: ${pc.gender}`);
    if (pc.conditions?.length) parts.push(`- Known Conditions: ${pc.conditions.join(', ')}`);
    if (pc.allergies?.length) parts.push(`- Allergies: ${pc.allergies.join(', ')}`);
    if (pc.currentMedications?.length) parts.push(`- Current Medications: ${pc.currentMedications.join(', ')}`);
  }

  if (context.encounterContext) {
    const ec = context.encounterContext;
    parts.push('\nENCOUNTER CONTEXT:');
    if (ec.chiefComplaint) parts.push(`- Chief Complaint: ${ec.chiefComplaint}`);
    if (ec.vitals) {
      parts.push('- Vitals:');
      Object.entries(ec.vitals).forEach(([key, value]) => {
        parts.push(`  - ${key}: ${value}`);
      });
    }
    if (ec.diagnoses?.length) parts.push(`- Working Diagnoses: ${ec.diagnoses.join(', ')}`);
  }

  return parts.join('\n');
}

/**
 * Hash string for audit logging
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

/**
 * Log AI interaction to database
 */
async function logAIInteraction(
  context: AIContext,
  prompt: string,
  response: string,
  modelVersion: string,
  latencyMs: number,
  tokensUsed?: number
): Promise<void> {
  try {
    await prisma.aIInteraction.create({
      data: {
        tenantId: context.tenantId,
        userId: context.userId,
        role: context.role,
        promptHash: hashString(prompt),
        prompt: prompt.substring(0, 5000), // Limit stored prompt length
        response: response.substring(0, 10000), // Limit stored response length
        responseHash: hashString(response),
        inputContext: context.additionalContext || {},
        modelVersion,
        latencyMs,
        tokensUsed,
      },
    });
  } catch (error) {
    console.error('Failed to log AI interaction:', error);
  }
}

/**
 * Main AI chat function with guardrails
 */
export async function aiChat(
  message: string,
  context: AIContext,
  sessionId?: string
): Promise<AIResponse> {
  const startTime = Date.now();

  // Check if AI is enabled
  if (!AI_ENABLED) {
    return {
      success: false,
      message: 'AI features are currently disabled. Please contact your administrator.',
      disclaimer: 'AI features require configuration.',
    };
  }

  // Check for valid API key
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-mock-key') {
    // Return mock response for development/demo
    return getMockResponse(message, context);
  }

  try {
    const systemPrompt = getSystemPrompt(context.role);
    const contextString = buildContextString(context);

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
    ];

    if (contextString) {
      messages.push({
        role: 'system',
        content: `Current Context:\n${contextString}`,
      });
    }

    messages.push({ role: 'user', content: message });

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const responseMessage = completion.choices[0]?.message?.content || 'No response generated.';
    const tokensUsed = completion.usage?.total_tokens;
    const latencyMs = Date.now() - startTime;

    // Log the interaction
    await logAIInteraction(
      context,
      message,
      responseMessage,
      MODEL,
      latencyMs,
      tokensUsed
    );

    return {
      success: true,
      message: responseMessage,
      tokensUsed,
      latencyMs,
      disclaimer: getDisclaimer(context.role),
    };
  } catch (error) {
    console.error('AI Chat Error:', error);
    return {
      success: false,
      message: 'Unable to process your request at this time. Please try again later.',
      disclaimer: 'An error occurred while processing your request.',
    };
  }
}

/**
 * Get role-specific disclaimer
 */
function getDisclaimer(role: Role): string {
  switch (role) {
    case 'DOCTOR':
      return 'AI suggestions are for reference only. Clinical decisions must be made by qualified physicians.';
    case 'NURSE':
      return 'AI suggestions should be verified with supervising physician for clinical actions.';
    case 'PATIENT':
      return 'This information is for educational purposes only. Please consult your healthcare provider for medical advice.';
    default:
      return 'AI-generated content. Please verify important information.';
  }
}

/**
 * Generate mock response for demo/development
 */
function getMockResponse(message: string, context: AIContext): AIResponse {
  const lowerMessage = message.toLowerCase();

  // Doctor-specific mock responses
  if (context.role === 'DOCTOR') {
    if (lowerMessage.includes('diagnosis') || lowerMessage.includes('differential')) {
      return {
        success: true,
        message: `Based on the presented symptoms, here are some differential diagnoses to consider:

1. **Primary Consideration**: Upper Respiratory Tract Infection (J06.9)
   - Consistent with: fever, cough, sore throat
   - Recommended: Symptomatic treatment, rest, hydration

2. **Alternative Considerations**:
   - Viral pharyngitis
   - Acute bronchitis
   - Allergic rhinitis (if seasonal pattern)

**Suggested Workup**:
- Complete blood count if symptoms persist > 7 days
- Throat culture if strep suspected
- Chest X-ray if lower respiratory symptoms develop

**Red Flags to Monitor**:
- High fever > 103°F
- Difficulty breathing
- Symptoms worsening after 5 days`,
        suggestions: [
          'Order CBC and basic metabolic panel',
          'Prescribe symptomatic treatment',
          'Schedule follow-up in 7 days',
        ],
        confidence: 0.85,
        disclaimer: 'AI suggestions are for reference only. Clinical decisions must be made by qualified physicians.',
        latencyMs: 500,
      };
    }

    if (lowerMessage.includes('summary') || lowerMessage.includes('soap')) {
      return {
        success: true,
        message: `**Clinical Summary**

**Subjective**: Patient presents with chief complaint of fever and body ache for 3 days. Reports mild cough and sore throat. No significant past medical history.

**Objective**: 
- Vitals: BP 120/80, HR 88, Temp 100.4°F, SpO2 98%
- General: Alert, oriented, mild distress
- HEENT: Mild pharyngeal erythema, no exudates
- Lungs: Clear to auscultation bilaterally

**Assessment**: Acute viral upper respiratory infection

**Plan**:
1. Symptomatic management with antipyretics
2. Adequate hydration and rest
3. Return if symptoms worsen or persist > 7 days`,
        suggestions: [
          'Add this summary to clinical notes',
          'Generate prescription',
          'Schedule follow-up',
        ],
        confidence: 0.9,
        disclaimer: 'AI suggestions are for reference only. Clinical decisions must be made by qualified physicians.',
        latencyMs: 450,
      };
    }
  }

  // Patient-specific mock responses
  if (context.role === 'PATIENT') {
    if (lowerMessage.includes('report') || lowerMessage.includes('result')) {
      return {
        success: true,
        message: `I can help you understand your medical reports!

**General Tips for Understanding Reports**:
- Lab reports show various measurements of your blood and body functions
- "Normal range" values are provided for comparison
- Values slightly outside the range aren't always concerning

**What to Do**:
- Discuss any concerns with your doctor during your next visit
- Keep copies of your reports for your records
- Note any symptoms you've been experiencing to share with your doctor

Would you like me to explain any specific terms or values from your report? Please share the specific details you'd like to understand better.`,
        suggestions: [
          'View my recent reports',
          'Schedule appointment with doctor',
          'Ask about specific test',
        ],
        disclaimer: 'This information is for educational purposes only. Please consult your healthcare provider for medical advice.',
        latencyMs: 300,
      };
    }

    if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) {
      return {
        success: true,
        message: `I can help you with appointment booking!

**Available Options**:
1. **Book New Appointment**: Choose your preferred doctor and time slot
2. **View Upcoming**: See your scheduled appointments
3. **Reschedule**: Change existing appointment time

**Quick Tips**:
- Morning slots (9 AM - 12 PM) usually have shorter wait times
- Bring your previous reports and prescription for follow-ups
- Arrive 15 minutes early for new consultations

Would you like me to help you book an appointment now?`,
        suggestions: [
          'Book new appointment',
          'View my appointments',
          'Find a specialist',
        ],
        disclaimer: 'This information is for educational purposes only. Please consult your healthcare provider for medical advice.',
        latencyMs: 250,
      };
    }
  }

  // Default mock response
  return {
    success: true,
    message: `Thank you for your question. I'm here to assist you with hospital-related queries.

Based on your question about "${message.substring(0, 50)}...", here are some ways I can help:

1. **Clinical Information**: Understanding medical terms and procedures
2. **Appointment Management**: Booking, rescheduling, or viewing appointments
3. **Reports & Records**: Accessing and understanding your medical records
4. **General Queries**: Hospital services, departments, and facilities

Please let me know what specific information you need, and I'll be happy to assist!

*Note: For medical emergencies, please contact emergency services immediately.*`,
    suggestions: [
      'Tell me more about your services',
      'Help me book an appointment',
      'Explain my recent report',
    ],
    disclaimer: getDisclaimer(context.role),
    latencyMs: 200,
  };
}

/**
 * Generate clinical summary using AI
 */
export async function generateClinicalSummary(
  context: AIContext,
  encounterData: {
    chiefComplaint: string;
    vitals: Record<string, string>;
    notes: string[];
    diagnoses: string[];
    prescriptions: string[];
  }
): Promise<AIResponse> {
  const prompt = `Generate a comprehensive clinical summary for this encounter:

Chief Complaint: ${encounterData.chiefComplaint}

Vitals:
${Object.entries(encounterData.vitals).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

Clinical Notes:
${encounterData.notes.join('\n')}

Diagnoses: ${encounterData.diagnoses.join(', ')}

Prescriptions: ${encounterData.prescriptions.join(', ')}

Please provide:
1. Brief summary of the encounter
2. Key findings
3. Treatment provided
4. Follow-up recommendations`;

  return aiChat(prompt, {
    ...context,
    encounterContext: {
      chiefComplaint: encounterData.chiefComplaint,
      vitals: encounterData.vitals,
      diagnoses: encounterData.diagnoses,
    },
  });
}

/**
 * Check for drug interactions
 */
export async function checkDrugInteractions(
  context: AIContext,
  medications: string[],
  newMedication: string
): Promise<AIResponse> {
  const prompt = `Check for potential drug interactions:

Current Medications:
${medications.map((m) => `- ${m}`).join('\n')}

New Medication to Add: ${newMedication}

Please identify:
1. Any known drug-drug interactions
2. Severity of interactions (if any)
3. Recommendations for safe prescribing
4. Alternative medications if interactions are significant`;

  return aiChat(prompt, context);
}

/**
 * Generate patient education content
 */
export async function generatePatientEducation(
  context: AIContext,
  topic: string
): Promise<AIResponse> {
  const prompt = `Generate patient-friendly educational content about: ${topic}

Requirements:
1. Use simple, non-medical language
2. Include practical tips
3. Emphasize when to seek medical attention
4. Keep it concise and easy to understand`;

  return aiChat(prompt, { ...context, role: 'PATIENT' as Role });
}

export default {
  aiChat,
  generateClinicalSummary,
  checkDrugInteractions,
  generatePatientEducation,
};
