"use client"

import { motion } from "framer-motion"
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

/**
 * AI Chat Widget Component
 * 
 * This is a floating chat widget that provides AI-powered shopping assistance.
 * 
 * MOCK MODE (Current):
 * - Returns pre-defined responses based on keywords
 * - Perfect for development and testing
 * 
 * TO GO LIVE WITH OPENAI:
 * 1. Set AI_CHAT_MODE="live" in .env
 * 2. Add OPENAI_API_KEY in .env
 * 3. Implement the streaming API call in sendMessage function
 * 
 * See /app/api/ai/chat/route.ts for the API implementation
 */
export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! 👋 I'm your shopping assistant. I can help you find products, answer questions about orders, or recommend items based on your preferences. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  /**
   * Mock AI response generator
   * In production, this would be replaced with actual OpenAI API calls
   */
  const getMockResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Product search intent
    if (lowerMessage.includes("find") || lowerMessage.includes("looking for") || lowerMessage.includes("search")) {
      return "I'd be happy to help you find products! You can browse our categories or use the search bar at the top. What type of product are you looking for? Electronics, fashion, home goods, or something else?"
    }
    
    // Order tracking intent
    if (lowerMessage.includes("order") || lowerMessage.includes("track") || lowerMessage.includes("shipping")) {
      return "To track your order, please go to 'My Orders' in your account. You'll need your order number which was sent to your email. Would you like me to help you find something else?"
    }
    
    // Return/refund intent
    if (lowerMessage.includes("return") || lowerMessage.includes("refund") || lowerMessage.includes("exchange")) {
      return "We have a 30-day return policy for most items. To initiate a return, go to 'My Orders', select the item, and click 'Return Item'. The refund will be processed within 5-7 business days. Need more help?"
    }
    
    // Recommendation intent
    if (lowerMessage.includes("recommend") || lowerMessage.includes("suggest") || lowerMessage.includes("best")) {
      return "Based on popular choices, I'd recommend checking out our featured products on the homepage! We have great deals on electronics and fashion items. Would you like specific recommendations for a category?"
    }
    
    // Greeting
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! Great to chat with you. I'm here to help with product searches, order questions, returns, or recommendations. What can I do for you?"
    }
    
    // Thank you
    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return "You're welcome! If you have any other questions, feel free to ask. Happy shopping! 🛒"
    }
    
    // Default response
    return "I understand you're asking about '" + userMessage.substring(0, 50) + "'. While I'm in demo mode, I can help with:\n\n• Finding products\n• Order tracking\n• Returns & refunds\n• Product recommendations\n\nWhat would you like help with?"
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    /**
     * MOCK IMPLEMENTATION
     * 
     * To implement real OpenAI streaming:
     * 
     * const response = await fetch('/api/ai/chat', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({
     *     messages: messages.concat(userMessage).map(m => ({
     *       role: m.role,
     *       content: m.content,
     *     })),
     *   }),
     * })
     * 
     * // Handle streaming response
     * const reader = response.body?.getReader()
     * // ... process stream
     */

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getMockResponse(userMessage.content),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="lg"
          className={`rounded-full w-14 h-14 shadow-2xl ${
            isOpen ? "bg-gray-800" : "animate-pulse-glow"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
      </motion.div>

      {/* Chat window */}
      <motion.div
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.95,
          y: isOpen ? 0 : 20,
        }}
        transition={{ duration: 0.2 }}
        className={`fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">AI Shopping Assistant</h3>
                <p className="text-xs opacity-80">Powered by AI • Always here to help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="h-80 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback
                      className={`text-xs ${
                        message.role === "assistant"
                          ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {message.role === "assistant" ? "AI" : "You"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-md"
                        : "bg-gray-100 text-gray-800 rounded-tl-md"
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-md">
                    <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              AI responses are for assistance only. Verify important info.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  )
}
