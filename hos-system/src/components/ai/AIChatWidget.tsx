/**
 * HOS - Hospital Management System
 * AI Chat Component
 * ===========================================
 * 
 * Floating AI assistant chat interface
 * Adapts based on user role (Clinical Copilot vs Health Assistant)
 * 
 * @module components/ai/AIChatWidget
 * @version 1.0.0
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  AlertCircle,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Role } from '@prisma/client';

// ============================================
// Type Definitions
// ============================================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIChatWidgetProps {
  /** User's role for context-aware responses */
  userRole: Role;
  /** User's display name */
  userName: string;
  /** Optional patient context for clinical queries */
  patientContext?: {
    id: string;
    name: string;
    age?: number;
    conditions?: string[];
  };
  /** Custom position class */
  className?: string;
}

// ============================================
// Role-Based Configuration
// ============================================

/**
 * Configuration based on user role
 */
const ROLE_CONFIG: Record<string, {
  title: string;
  subtitle: string;
  placeholder: string;
  gradient: string;
  suggestions: string[];
}> = {
  DOCTOR: {
    title: 'AI Clinical Copilot',
    subtitle: 'Your intelligent clinical assistant',
    placeholder: 'Ask about diagnoses, medications, clinical guidelines...',
    gradient: 'from-blue-600 to-indigo-700',
    suggestions: [
      'Generate SOAP note',
      'Check drug interactions',
      'Differential diagnosis',
      'Treatment guidelines',
    ],
  },
  NURSE: {
    title: 'AI Nursing Assistant',
    subtitle: 'Clinical support for nursing care',
    placeholder: 'Ask about vitals, medications, care protocols...',
    gradient: 'from-green-600 to-emerald-700',
    suggestions: [
      'Vital sign interpretation',
      'Medication schedule',
      'Care documentation',
      'Handover report',
    ],
  },
  PATIENT: {
    title: 'Health Assistant',
    subtitle: 'Your personal health guide',
    placeholder: 'Ask about your health, reports, appointments...',
    gradient: 'from-orange-500 to-orange-600',
    suggestions: [
      'Explain my report',
      'Book appointment',
      'Medication reminder',
      'Health tips',
    ],
  },
  DEFAULT: {
    title: 'AI Assistant',
    subtitle: 'How can I help you today?',
    placeholder: 'Type your question...',
    gradient: 'from-blue-600 to-blue-700',
    suggestions: [
      'Help me with...',
      'Show me reports',
      'Navigate to...',
    ],
  },
};

// ============================================
// AI Chat Widget Component
// ============================================

/**
 * Floating AI chat widget with role-based persona
 * 
 * @example
 * ```tsx
 * <AIChatWidget
 *   userRole="DOCTOR"
 *   userName="Dr. Sharma"
 *   patientContext={{ id: 'p1', name: 'Rahul Verma', age: 35 }}
 * />
 * ```
 */
export function AIChatWidget({
  userRole,
  userName,
  patientContext,
  className,
}: AIChatWidgetProps) {
  // ----------------------------------------
  // State Management
  // ----------------------------------------
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs for scroll management
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get role-specific configuration
  const config = ROLE_CONFIG[userRole] || ROLE_CONFIG.DEFAULT;

  // ----------------------------------------
  // Effects
  // ----------------------------------------
  
  /**
   * Auto-scroll to latest message
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Focus input when chat opens
   */
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // ----------------------------------------
  // Handlers
  // ----------------------------------------

  /**
   * Generate unique message ID
   */
  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Send message to AI backend
   */
  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call AI API endpoint
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          context: patientContext ? { patientId: patientContext.id } : undefined,
        }),
      });

      const data = await response.json();

      // Add AI response
      const aiMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.message || 'I apologize, but I couldn\'t process that request.',
        timestamp: new Date(),
        suggestions: data.suggestions,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      // Handle error with user-friendly message
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle suggestion click
   */
  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  /**
   * Clear chat history
   */
  const clearChat = () => {
    setMessages([]);
  };

  // ----------------------------------------
  // Render
  // ----------------------------------------

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      <AnimatePresence>
        {/* Chat Window */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              'absolute bottom-16 right-0 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border overflow-hidden',
              isMinimized ? 'w-72 h-14' : 'w-96 h-[500px]'
            )}
          >
            {/* Header */}
            <div className={cn(
              'flex items-center justify-between p-4 text-white bg-gradient-to-r',
              config.gradient
            )}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                {!isMinimized && (
                  <div>
                    <h3 className="font-semibold">{config.title}</h3>
                    <p className="text-xs text-white/80">{config.subtitle}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content (hidden when minimized) */}
            {!isMinimized && (
              <>
                {/* Patient Context Banner */}
                {patientContext && (
                  <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Context: <strong>{patientContext.name}</strong>
                      {patientContext.age && `, ${patientContext.age} yrs`}
                    </p>
                  </div>
                )}

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: patientContext ? 'calc(100% - 180px)' : 'calc(100% - 150px)' }}>
                  {/* Welcome Message */}
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mx-auto mb-4">
                        <Bot className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">
                        Hi {userName.split(' ')[0]}! How can I help you today?
                      </p>
                      
                      {/* Quick Suggestions */}
                      <div className="flex flex-wrap justify-center gap-2">
                        {config.suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message List */}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex gap-3',
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      )}
                    >
                      {/* Avatar */}
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                        message.role === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30'
                      )}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4 text-blue-600" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-2',
                        message.role === 'user'
                          ? 'bg-primary text-white rounded-br-md'
                          : 'bg-muted rounded-bl-md'
                      )}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/20 flex flex-wrap gap-1">
                            {message.suggestions.map((suggestion) => (
                              <button
                                key={suggestion}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={config.placeholder}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!input.trim() || isLoading}
                      className="rounded-full"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Disclaimer */}
                  <p className="text-[10px] text-muted-foreground text-center mt-2">
                    AI suggestions are for reference only. Always verify with professionals.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors bg-gradient-to-r',
          config.gradient,
          'text-white'
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </motion.button>
    </div>
  );
}

export default AIChatWidget;
