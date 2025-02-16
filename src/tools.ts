import { z } from 'zod';

export const tools = {
  // return to me the insurance id that the contract will give you
  createInsurance: {
    schema: z.object({
      amount: z.number(),
      coverage: z.string(),
      duration: z.number()
    }),
    execute: async () => {
      return {
        type: 'client-side',
        action: 'buyInsurance'
      };
    }
  }
};

export const toolsSystemPrompt = `
Available tools:

5. buyInsurance: Purchase insurance coverage
   - Use when user wants to buy insurance
   - Parameters: amount (number), coverage (string), duration (number)

6. claimInsurance: File an insurance claim
   - Use when user wants to claim insurance
   - Parameters: policyId (string), reason (string), amount (number)

Guidelines:
- 
`;