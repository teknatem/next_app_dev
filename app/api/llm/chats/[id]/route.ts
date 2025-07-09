import { NextRequest, NextResponse } from 'next/server';
import { LlmChatService } from '@/shared/database/services';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const chatId = parseInt(id);
    const updates = await request.json();
    
    if (isNaN(chatId)) {
      return NextResponse.json(
        { error: 'Invalid chat ID' },
        { status: 400 }
      );
    }
    
    const chatService = new LlmChatService();
    const chat = await chatService.updateChat(chatId, updates);
    
    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }
    
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
    console.error('Update chat error:', error);
    return NextResponse.json(
      { error: 'Failed to update chat' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const chatId = parseInt(id);
    
    if (isNaN(chatId)) {
      return NextResponse.json(
        { error: 'Invalid chat ID' },
        { status: 400 }
      );
    }
    
    const chatService = new LlmChatService();
    const success = await chatService.deleteChat(chatId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete chat error:', error);
    return NextResponse.json(
      { error: 'Failed to delete chat' },
      { status: 500 }
    );
  }
} 