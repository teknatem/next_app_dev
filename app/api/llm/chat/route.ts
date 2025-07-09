import { NextRequest, NextResponse } from 'next/server';
import { LlmChatService } from '@/shared/database/services';
import type { ChatSettings } from '@/widgets/llm-chat/types';

export async function POST(request: NextRequest) {
  try {
    const { chatId, message, settings } = await request.json();
    
    if (!chatId || !message) {
      return NextResponse.json(
        { error: 'Chat ID and message are required' },
        { status: 400 }
      );
    }

    const chatService = new LlmChatService();
    
    // Save user message
    const userMessage = await chatService.addMessage({
      chatId,
      role: 'user',
      content: message,
      model: settings.model,
      provider: 'openai',
    });

    // Call OpenAI API
    const aiResponse = await callOpenAI(chatId, message, settings);
    
    // Save assistant message
    const assistantMessage = await chatService.addMessage({
      chatId,
      role: 'assistant',
      content: aiResponse.content,
      model: settings.model,
      provider: 'openai',
      promptTokens: aiResponse.promptTokens,
      completionTokens: aiResponse.completionTokens,
      totalTokens: aiResponse.totalTokens,
      cost: aiResponse.cost,
      finishReason: aiResponse.finishReason,
      responseTime: aiResponse.responseTime,
    });

    return NextResponse.json({
      message: userMessage,
      response: assistantMessage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

async function callOpenAI(chatId: number, message: string, settings: ChatSettings) {
  // This will be implemented once we have OpenAI API key
  const startTime = Date.now();
  
  // Mock response for now
  const mockResponse = {
    content: `This is a mock response to: "${message}". OpenAI integration will be implemented once API keys are configured.`,
    promptTokens: 10,
    completionTokens: 20,
    totalTokens: 30,
    cost: '0.000045',
    finishReason: 'stop',
    responseTime: Date.now() - startTime,
  };
  
  return mockResponse;
  
  // TODO: Implement real OpenAI API call
  /*
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  const response = await openai.chat.completions.create({
    model: settings.model,
    messages: [{ role: 'user', content: message }],
    temperature: settings.temperature,
    max_tokens: settings.maxTokens,
  });
  
  return {
    content: response.choices[0].message.content,
    promptTokens: response.usage?.prompt_tokens || 0,
    completionTokens: response.usage?.completion_tokens || 0,
    totalTokens: response.usage?.total_tokens || 0,
    cost: calculateCost(response.usage, settings.model),
    finishReason: response.choices[0].finish_reason,
    responseTime: Date.now() - startTime,
  };
  */
} 