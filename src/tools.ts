import { z } from 'zod';

export const tools = {
  // return to me the insurance id that the contract will give you
  createInsurance: {
    schema: z.object({
      amount: z.number(),
      coverage: z.string(),
      duration: z.number()
    }),
    execute: async (test: any) => {
      return 1
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