import { NextRequest, NextResponse } from 'next/server';
import { LlmChatService } from '@/shared/database/services/llm-chat.service';

export async function POST(request: NextRequest) {
  try {
    const { chatId, message } = await request.json();

    if (!chatId || !message) {
      return NextResponse.json(
        { error: 'chatId and message are required' },
        { status: 400 }
      );
    }

    const chatService = new LlmChatService();

    // Save user message
    const userMessage = await chatService.addMessage({
      chatId,
      role: 'user',
      content: message
    });

    // Mock AI response
    const aiResponse = {
      content: `This is a mock response to: "${message}"`
      // other fields can be added here if needed by addMessage
    };

    // Save assistant message
    const assistantMessage = await chatService.addMessage({
      chatId,
      role: 'assistant',
      content: aiResponse.content
    });

    return NextResponse.json({
      message: userMessage,
      response: assistantMessage
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
