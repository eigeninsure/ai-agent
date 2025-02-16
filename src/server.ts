import { tools, toolsSystemPrompt } from './tools.js';

import cors from 'cors';
import { createAgent } from './agent/createAgent.js';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

let agent: Awaited<ReturnType<typeof createAgent>>;

createAgent().then(a => {
  agent = a;
  console.log('Agent initialized successfully');
}).catch(error => {
  console.error('Failed to initialize agent:', error);
  process.exit(1);
});

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', agentReady: !!agent });
});

app.post('/api/generate', async (req, res) => {
  try {
    if (!agent) {
      return res.status(503).json({ error: 'Agent not ready' });
    }

    const messages: string[] = req.body.messages;
    const prompt: string = messages[messages.length - 1];
    const system: string = req.body.system;

    const response = await agent.generateVerifiableText(
      JSON.stringify({
        prompt,
        messages,
        system: `${system}\n\n${toolsSystemPrompt}`,
        tools
      })
    ) as unknown as { content: string; proof: any };

    const parsedResponse = JSON.parse(response.content) as { text: string; toolCall?: { name: string; arguments: [any] } };


    if (parsedResponse.toolCall && tools[parsedResponse.toolCall.name as keyof typeof tools]) {
      const tool = tools[parsedResponse.toolCall.name as keyof typeof tools];

      if (!tool) {
        throw new Error(`Tool ${parsedResponse.toolCall.name} not found`);
      }

      try {
        const result = await tool.execute(...parsedResponse.toolCall.arguments);
        return res.json({
          text: parsedResponse.text,
          ...result
        }
        );
      } catch (error) {
        console.error(`Error executing tool ${parsedResponse.toolCall.name}:`, error);
        throw error;
      }
    }

    return res.json(parsedResponse)
  } catch (error) {
    console.error('Error generating text:', error);
    res.status(500).json({
      error: 'Failed to generate text',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});