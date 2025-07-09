import { NextRequest, NextResponse } from 'next/server';
import { LlmChatService } from '@/shared/database/services';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chatId = parseInt(params.id);
    
    if (isNaN(chatId)) {
      return NextResponse.json(
        { error: 'Invalid chat ID' },
        { status: 400 }
      );
    }
    
    const chatService = new LlmChatService();
    const messages = await chatService.getChatMessages(chatId);
    
    // Transform to ChatMessage format
    const chatMessages = messages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      model: msg.model,
      createdAt: msg.createdAt,
    }));
    
    return NextResponse.json(chatMessages);
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
} 