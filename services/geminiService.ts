import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize client only if key exists to avoid immediate crash, though strict requirement means it should be there.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateResumeContent = async (prompt: string): Promise<string> => {
  if (!ai) throw new Error("API Key missing");
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert resume writer and career coach. Improve the user's resume content to be impactful, action-oriented, and professional.",
      }
    });
    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating content. Please try again.";
  }
};

export const generateCoverLetter = async (jobTitle: string, company: string, userProfileStr: string): Promise<string> => {
  if (!ai) throw new Error("API Key missing");

  const prompt = `Write a professional cover letter for the position of ${jobTitle} at ${company}. 
  Here is my background: ${userProfileStr}. 
  Keep it concise, engaging, and professional.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Failed to generate cover letter.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating cover letter.";
  }
};

export const createInterviewChat = (jobTitle: string, company: string): Chat | null => {
  if (!ai) return null;
  
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are a professional hiring manager at ${company} interviewing a candidate for the ${jobTitle} position. 
      Ask relevant behavioral and technical questions based on the role. 
      Start by welcoming the candidate and asking them to introduce themselves. 
      Ask one question at a time. After 5 questions, give brief feedback.`,
    },
  });
};

export const analyzeJobFit = async (resumeText: string, jobDescription: string): Promise<string> => {
  if (!ai) throw new Error("API Key missing");

  const prompt = `Analyze the fit between this candidate profile and the job description.
  
  Candidate Profile:
  ${resumeText}

  Job Description:
  ${jobDescription}

  Provide a percentage match score (e.g., "85% Match") followed by a brief list of "Key Strengths" and "Missing Skills".`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not analyze fit.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error analyzing fit.";
  }
};
