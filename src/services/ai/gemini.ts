import { GoogleGenerativeAI } from '@google/generative-ai';
import { useSettingsStore } from '../../store/settingsStore';

const MODEL_NAME = 'gemini-1.5-pro';

export interface ProcessResult {
    text: string;
    data?: any; // Structured JSON if requested
}

const getModel = () => {
    const apiKey = useSettingsStore.getState().apiKey;
    if (!apiKey) throw new Error('API Key not set');
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: MODEL_NAME });
};

export const processImage = async (base64Image: string): Promise<ProcessResult> => {
    try {
        const model = getModel();
        const prompt = `
      Analyze this image. 
      1. Extract all legible text.
      2. Summarize the key information.
      3. Identify any "Action Items" (tasks).
      4. Return the result as a valid JSON object with keys: "full_text", "summary", "action_items" (array of strings).
    `;

        // Explicitly requesting JSON response is safer with newer models, but purely prompt-based often works too.
        // We will ask for JSON in the prompt.
        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }
        ]);

        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const data = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

        return {
            text: responseText,
            data
        };
    } catch (error) {
        console.error('Gemini Image Error:', error);
        throw error;
    }
};

export const processAudio = async (base64Audio: string, ownerName: string = "Owner"): Promise<ProcessResult> => {
    try {
        const model = getModel();
        // Prompt for diarization and extraction
        const prompt = `
      You are an expert secretary. Listen to this recording.
      1. Transcribe the conversation accurately.
      2. Identify speakers. One speaker is likely "${ownerName}". Label others as "Speaker B", "Speaker C", etc.
      3. Create a "Dossier Update" for each person detected (excluding the owner). What did we learn about them? (Facts, Opinions, Hobbies).
      4. Extract "Action Items". Who is responsible? When is it due? Is it URGENT?
      5. Identify any "Problems" or "Initiatives" discussed.
      
      Return the output as a valid JSON object with this structure:
      {
        "transcript": "Speaker A: ...",
        "speakers": ["${ownerName}", "Speaker B"...],
        "dossier_updates": [ { "person": "Speaker B", "updates": ["Loves hiking", "Wants to buy a boat"] } ],
        "action_items": [ { "task": "Send email", "assignee": "Speaker B", "urgency": "high"|"low", "due_in_hours": 24 } ],
        "problems": [ { "title": "Project X Delay", "description": "..." } ]
      }
    `;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Audio, mimeType: 'audio/m4a' } } // Assuming m4a from Expo AV
        ]);

        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const data = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

        return {
            text: responseText,
            data
        };
    } catch (error) {
        console.error('Gemini Audio Error:', error);
        throw error;
    }
};
