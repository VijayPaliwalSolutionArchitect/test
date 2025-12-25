import { NextResponse } from "next/server"

/**
 * AI Chat API Route
 * 
 * This endpoint handles AI-powered chat for shopping assistance.
 * 
 * MOCK MODE (Current Implementation):
 * - Returns pre-defined responses based on message content
 * - No external API calls required
 * - Perfect for development and testing
 * 
 * TO GO LIVE WITH OPENAI:
 * 1. Set AI_CHAT_MODE="live" in .env
 * 2. Add OPENAI_API_KEY to .env
 * 3. Install openai package: yarn add openai
 * 4. Uncomment the OpenAI implementation below
 */

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

// Mock AI response generator
function getMockResponse(messages: ChatMessage[]): string {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || ""
  
  if (lastMessage.includes("find") || lastMessage.includes("looking for") || lastMessage.includes("search")) {
    return "I'd be happy to help you find products! You can browse our categories or use the search bar at the top. What type of product are you looking for? Electronics, fashion, home goods, or something else?"
  }
  
  if (lastMessage.includes("order") || lastMessage.includes("track") || lastMessage.includes("shipping")) {
    return "To track your order, please go to 'My Orders' in your account. You'll need your order number which was sent to your email. Would you like me to help you find something else?"
  }
  
  if (lastMessage.includes("return") || lastMessage.includes("refund") || lastMessage.includes("exchange")) {
    return "We have a 30-day return policy for most items. To initiate a return, go to 'My Orders', select the item, and click 'Return Item'. The refund will be processed within 5-7 business days. Need more help?"
  }
  
  if (lastMessage.includes("recommend") || lastMessage.includes("suggest") || lastMessage.includes("best")) {
    return "Based on popular choices, I'd recommend checking out our featured products on the homepage! We have great deals on electronics and fashion items. Would you like specific recommendations for a category?"
  }
  
  if (lastMessage.includes("price") || lastMessage.includes("discount") || lastMessage.includes("sale")) {
    return "Great question! We regularly have sales and promotions. Check out our 'Sale' section for current discounts. You can also subscribe to our newsletter for exclusive deals. Is there a specific product you're interested in?"
  }
  
  return "I understand you're asking about '" + lastMessage.substring(0, 30) + "...'. I can help with:\n\n• Finding products\n• Order tracking\n• Returns & refunds\n• Product recommendations\n\nWhat would you like help with?"
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages, sessionId } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      )
    }

    const aiMode = process.env.AI_CHAT_MODE || "mock"

    if (aiMode === "live") {
      /**
       * LIVE OPENAI IMPLEMENTATION
       * Uncomment below when going live:
       * 
       * import OpenAI from 'openai'
       * 
       * const openai = new OpenAI({
       *   apiKey: process.env.OPENAI_API_KEY,
       * })
       * 
       * const systemPrompt = `You are a helpful e-commerce shopping assistant for SuperStore.
       * Help users find products, answer questions about orders, and provide recommendations.
       * Be concise, friendly, and professional. If you don't know something, say so.
       * Don't make up product information - direct users to the website.`
       * 
       * const response = await openai.chat.completions.create({
       *   model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
       *   messages: [
       *     { role: 'system', content: systemPrompt },
       *     ...messages,
       *   ],
       *   temperature: 0.7,
       *   max_tokens: 500,
       * })
       * 
       * return NextResponse.json({
       *   success: true,
       *   message: response.choices[0].message.content,
       *   usage: response.usage,
       * })
       */
    }

    // Mock mode response
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

    const response = getMockResponse(messages)

    return NextResponse.json({
      success: true,
      message: response,
      mode: "mock", // Indicator that this is mock mode
    })
  } catch (error) {
    console.error("AI Chat error:", error)
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    )
  }
}
