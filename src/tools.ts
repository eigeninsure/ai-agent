import { z } from 'zod';

export const tools = {
  // Server-side tools
  createDocument: {
    schema: z.object({
      title: z.string(),
      kind: z.enum(['text', 'code', 'sheet', 'image']),
    }),
    execute: async (args: { title: string; kind: string }) => {
      console.log('Creating document:', args);
      return {
        id: crypto.randomUUID(),
        title: args.title,
        kind: args.kind,
        content: `Initial content for ${args.title}`
      };
    }
  },

  updateDocument: {
    schema: z.object({
      id: z.string(),
      content: z.string(),
      description: z.string()
    }),
    execute: async (args: { id: string; content: string; description: string }) => {
      console.log('Updating document:', args);
      return {
        id: args.id,
        content: args.content,
        description: args.description
      };
    }
  },

  requestSuggestions: {
    schema: z.object({
      documentId: z.string().describe('The ID of the document to request edits')
    }),
    execute: async (args: { documentId: string }) => {
      console.log('Requesting suggestions:', args);
      return {
        suggestions: [
          {
            id: crypto.randomUUID(),
            originalText: "Sample original text",
            suggestedText: "Improved version of the text",
            description: "Enhanced clarity and conciseness",
            documentId: args.documentId,
            isResolved: false
          }
        ]
      };
    }
  },

  getWeather: {
    schema: z.object({
      latitude: z.number(),
      longitude: z.number()
    }),
    execute: async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
      );
      return await response.json();
    }
  },

  // Client-side tools (these will be handled differently in the frontend)
  buyInsurance: {
    schema: z.object({
      amount: z.number(),
      coverage: z.string(),
      duration: z.number()
    }),
    execute: async () => {
      // Return a placeholder - actual execution happens client-side
      return {
        type: 'client-side',
        action: 'buyInsurance'
      };
    }
  },

  claimInsurance: {
    schema: z.object({
      policyId: z.string(),
      reason: z.string(),
      amount: z.number()
    }),
    execute: async () => {
      // Return a placeholder - actual execution happens client-side
      return {
        type: 'client-side',
        action: 'claimInsurance'
      };
    }
  }
};

export const toolsSystemPrompt = `
Available tools:

1. createDocument: Create a new document
   - Use when asked to write substantial content or code
   - Parameters: title (string), kind ("text" | "code" | "sheet" | "image")

2. updateDocument: Update an existing document
   - Use when asked to modify existing content
   - Parameters: id (string), content (string), description (string)

3. requestSuggestions: Get improvement suggestions for a document
   - Use when asked to review or improve content
   - Parameters: documentId (string)

4. getWeather: Get weather information
   - Use when asked about weather conditions
   - Parameters: latitude (number), longitude (number)

5. buyInsurance: Purchase insurance coverage
   - Use when user wants to buy insurance
   - Parameters: amount (number), coverage (string), duration (number)

6. claimInsurance: File an insurance claim
   - Use when user wants to claim insurance
   - Parameters: policyId (string), reason (string), amount (number)

Guidelines:
- Always use createDocument for code snippets or long content
- Wait for user feedback before updating documents
- Provide clear descriptions when requesting suggestions
- For insurance operations, explain the process to the user
`;