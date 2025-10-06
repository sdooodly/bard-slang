import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const stylePrompts: { [key: string]: string } = {
    shakespearean: "Translate this into a single, concise, and slightly humorous Shakespearean phrase, using period phrasing: ",
    corporate: "Transform this into a single, concise, and overly formal phrase using maximum corporate jargon and buzzwords (e.g., 'synergy', 'deep dive', 'action item'): ",
    slang: "Convert this into a single, concise, and slightly exaggerated internet slang phrase (e.g., 'fr', 'lit', 'no cap'): ",
};

export async function POST(req: Request) {
    try {
        const { text, style } = await req.json();
        if (!text || typeof text !== 'string' || text.length === 0) {
            return NextResponse.json({ error: "Input text is required." }, { status: 400 });
        }
        if (!style || !stylePrompts[style]) {
            return NextResponse.json({ error: "Invalid style selected." }, { status: 400 });
        }
        const globalSystemInstruction = "You are a witty linguistic converter. Always respond ONLY with the translated phrase. Do not include any explanations, rationales, headers, or bullet points.";
        const localPromptInstruction = stylePrompts[style];
        const finalPrompt = `${localPromptInstruction} "${text}"`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: finalPrompt,
            config: {
                systemInstruction: globalSystemInstruction,
                temperature: 0.8,
            }
        });
        const convertedText = (response.text ?? "").trim();
        return NextResponse.json({ result: convertedText });
    } catch (error) {
        return NextResponse.json({ error: "An internal server error occurred during conversion." }, { status: 500 });
    }
}