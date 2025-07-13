import { NextResponse } from 'next/server';

import { LlmChatService } from '@/shared/database/services';

export async function GET() {
  try {
    const chatService = new LlmChatService();
    
    // Create a test chat
    const testChat = await chatService.createChat({
      title: 'Test Chat',
      defaultModel: 'gpt-3.5-turbo',
    });
    
    // Add a test message
    const testMessage = await chatService.addMessage({
      chatId: testChat.id,
      role: 'user',
      content: 'Hello, this is a test message!',
      model: 'gpt-3.5-turbo',
      provider: 'openai',
    });
    
    // Get all chats
    const allChats = await chatService.getAllChats();
    
    // Get chat with messages
    const chatWithMessages = await chatService.getChatWithMessages(testChat.id);
    
    return NextResponse.json({
      success: true,
      message: 'LLM Chat system is working!',
      data: {
        testChat,
        testMessage,
        totalChats: allChats.length,
        chatWithMessages,
      },
    });
  } catch (error) {
    console.error('Test LLM Chat error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to test LLM chat system',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 