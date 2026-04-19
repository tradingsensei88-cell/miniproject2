import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY environment variable. Please add it to your .env.local file." }, 
        { status: 500 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array provided." }, { status: 400 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: "You are a highly capable, helpful, and intelligent AI assistant. Provide clear, concise, and accurate answers to the user's queries in a natural, conversational tone." 
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API Error response:", errorData);
      return NextResponse.json(
        { error: errorData?.error?.message || `Groq API Error: ${response.status}` }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ 
      content: data.choices[0].message.content,
      role: data.choices[0].message.role || "assistant" 
    });

  } catch (error: any) {
    console.error("Chat API Logic Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
