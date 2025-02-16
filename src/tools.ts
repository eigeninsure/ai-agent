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

1. createInsurance: Purchase insurance coverage
   - Use when user wants to buy insurance
   - Parameters: amount (number), coverage (string), duration (number)

Guidelines:
- If a tool call is made, please provide a stringifed json object that contains the
toolCall name, and all the parameter values in order.
- The text will be the text response to the user that details what has been done.

Output Format: {text: string; toolCalls?: { name: string; arguments: [arg1, arg2, arg3, ...] }}
`;

/*
6. claimInsurance: File an insurance claim
   - Use when user wants to claim insurance
   - Parameters: policyId (string), reason (string), amount (number)
   */