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

    const { messages, system, prompt } = req.body;

    const result = await agent.generateVerifiableText(
      JSON.stringify({
        prompt,
        messages,
        system: `${system}\n\n${toolsSystemPrompt}`,
        tools
      })
    ) as unknown as { text: string; toolCalls?: { name: string; arguments: any }[] };

    if (result.toolCalls && result.toolCalls.length > 0) {
      const toolResults = await Promise.all(
        result.toolCalls.map(async (toolCall) => {
          const tool = tools[toolCall.name as keyof typeof tools];
          if (!tool) {
            throw new Error(`Tool ${toolCall.name} not found`);
          }
          try {
            const validatedArgs = tool.schema.parse(toolCall.arguments);
            const result = await tool.execute() as any;

            // Mark client-side tools
            if (result.type === 'client-side') {
              return {
                ...result,
                args: validatedArgs
              };
            }

            return result;
          } catch (error) {
            console.error(`Error executing tool ${toolCall.name}:`, error);
            throw error;
          }
        })
      );

      return res.json({
        content: result.text,
        toolCalls: result.toolCalls,
        toolResults
      });
    }

    return res.json({
      content: result.text
    });

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