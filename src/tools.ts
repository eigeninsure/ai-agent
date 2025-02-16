import { PinataSDK } from 'pinata-web3';
import { z } from 'zod';

export const tools = {
  // return to me the insurance id that the contract will give you
  createInsurance: {
    schema: z.object({
      amount: z.number(),
      coverage: z.string(),
      duration: z.number()
    }),
    execute: async (amount: number, coverage: string, duration: number) => {
      console.log("Buy insurance with ", amount, coverage, duration)
      // upload claim description to IPFS and get its IPFS CID
      const pinata = new PinataSDK({
        pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0ZWM1OGNlZi1kNjkyLTQxYmQtOTQwNi03MTAyYzFmNzlhODkiLCJlbWFpbCI6ImJ3aWxsaWFtd2FuZ0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDU4ODg2OTE1MmNmNmQyNWZjZmMiLCJzY29wZWRLZXlTZWNyZXQiOiI1Y2JiMTNmZDliZGFhOTg2OTc3MTVjN2Q2NjU5ZWVlYTNhN2M4MGJiNWY1ZDQwZGY4YWMyNTRmNDM1NWNkNjcwIiwiZXhwIjoxNzcxMTc5NjM3fQ.nOfkaD5YbuMH5nqVSS8IXdpQ9myhOGs-2xvCehd8ZsI",
        pinataGateway: "brown-real-puma-604.mypinata.cloud",
      });
      const upload = await pinata.upload.json({
        name: "EigenInsure Insurance Claim",
        amount,
        coverage,
        duration
      })
      const ipfsCid = upload.IpfsHash
      console.log("Insurance Creation saved to IPFS ", ipfsCid)

      return {
        ipfsCid,
        type: 'client-side',
        action: 'createInsurance'
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
- The text will be the text response to the user that details what has been done.
- If a tool call is made, please provide a stringifed json object that contains the
toolCall name, and all the parameter values in order.

Output Format: {text: string; toolCalls?: { name: string; arguments: [arg1, arg2, arg3, ...] }}
`;

/*
6. claimInsurance: File an insurance claim
   - Use when user wants to claim insurance
   - Parameters: policyId (string), reason (string), amount (number)
   */