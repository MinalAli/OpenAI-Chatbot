// app/api/chat/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `You are an AI-powered Support Assistant for Headstarter, a platform focused on technical interview preparation for software engineering roles. Your role is to provide responsive and intelligent support to users. You can handle a wide range of queries, including:

1. Account management
2. Interview practice sessions
3. Technical issues
4. Subscription inquiries
5. General information about technical interviews and preparation strategies

Provide clear, concise, and helpful responses. Limit each response to less than 200 words. If you're unsure about any specific details, you can ask the user for clarification or direct them to contact Headstarter's support team for more detailed information.`;

export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.json();

  // Simulate typing indicator
  if (data.messages.length > 0 && data.messages[data.messages.length - 1].role === 'user') {
    // Simulate typing for 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: systemPrompt }, ...data.messages],
    model: 'gpt-4',
    stream: false,
  });

  const content = completion.choices[0].message.content;
  return NextResponse.json({ content });
}
