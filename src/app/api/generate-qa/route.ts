import { NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParseModule = require('pdf-parse');
const pdfParse = typeof pdfParseModule === 'function' ? pdfParseModule : (pdfParseModule.default || pdfParseModule.PDFParse || pdfParseModule);
import mammoth from 'mammoth';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let text = "";

    try {
      if (file.type === "application/pdf") {
        const data = await pdfParse(buffer);
        text = data.text;
      } else if (
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
        file.name.endsWith('.docx')
      ) {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } else if (file.type === "text/plain" || file.name.endsWith('.txt')) {
        text = buffer.toString('utf-8');
      } else {
        return NextResponse.json({ error: "Unsupported file format. Please upload PDF, DOCX, or TXT." }, { status: 400 });
      }
    } catch (parseError: any) {
      console.error("Parse Error:", parseError);
      return NextResponse.json({ error: `Failed to parse the document contents. Err: ${parseError.message || String(parseError)}` }, { status: 500 });
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "No text could be extracted from the file." }, { status: 400 });
    }

    // Truncate text if it's absurdly long just to prevent token limit errors
    const truncatedText = text.substring(0, 15000); 

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GROQ_API_KEY environment variable." }, { status: 500 });
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
            content: `You are an expert academic examiner. Based on the provided manual/text, generate exactly 10 to 20 highly relevant, important questions and their concise answers. 
            You MUST return ONLY a valid JSON array of objects. Do not include any markdown formatting, explanatory text, or code blocks.
            Format: [{"question": "...", "answer": "..."}, ...]`
          },
          {
            role: "user",
            content: `Manual Text: ${truncatedText}`
          }
        ],
        temperature: 0.3, // Lower temperature for more structured JSON output
        max_tokens: 3000,
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
    let content = data.choices[0].message.content.trim();

    // Sometimes the LLM might still wrap in markdown or backticks despite being told not to
    if (content.startsWith("```json")) {
      content = content.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    }
    
    let qaData;
    try {
      qaData = JSON.parse(content);
    } catch (jsonError) {
      console.error("JSON Parsing Error from Groq response:", content);
      return NextResponse.json({ error: "Failed to parse the AI response into structured Q&A." }, { status: 500 });
    }

    return NextResponse.json({ qaData });

  } catch (error: any) {
    console.error("Generate QA API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
