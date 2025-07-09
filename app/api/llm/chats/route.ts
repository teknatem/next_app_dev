import { NextRequest, NextResponse } from 'next/server';
import { LlmChatService } from '@/shared/database/services';

export async function GET() {
  try {
    const chatService = new LlmChatService();
    const chats = await chatService.getAllChats();
    
    // Transform to ChatSession format
    const chatSessions = chats.map(chat => ({
      id: chat.id,
      title: chat.title,
      messageCount: chat.messageCount || 0,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }));
    
    return NextResponse.json(chatSessions);
  } catch (error) {
    console.error('Get chats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    const chatService = new LlmChatService();
    const chat = await chatService.createChat({
      title,
      defaultModel: 'gpt-3.5-turbo',
    });
    
    // Transform to ChatSession format
    const chatSession = {
      id: chat.id,
      title: chat.title,
      messageCount: chat.messageCount || 0,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
    
    return NextResponse.json(chatSession);
  } catch (error) {
    console.error('Create chat error:', error);
    return NextResponse.json(
      { error: 'Failed to create chat' },
      { status: 500 }
    );
  }
} 