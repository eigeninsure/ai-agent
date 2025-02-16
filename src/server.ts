import express from 'express';
import cors from 'cors';
import { createAgent } from './agent/createAgent.js';
import { tools, toolsSystemPrompt } from './tools.js';

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

    const { messages, system } = req.body;

    const result = await agent.generateVerifiableText(
      JSON.stringify({
        messages,
        system: `${system}\n\n${toolsSystemPrompt}`,
        tools
      })
    ) as unknown as { text: string; toolCalls?: { name: string; arguments: any }[] };

    if (result.toolCalls && result.toolCalls.length > 0) {
      const toolResults = result.toolCalls.map(toolCall => {
        // Only execute buy_insurance, return tool calls for others
        if (toolCall.name === 'buyInsurance') {
          return {
            type: 'client-side',
            action: 'buyInsurance',
            args: toolCall.arguments
          };
        }
        
        return {
          type: 'tool-call',
          name: toolCall.name,
          arguments: toolCall.arguments
        };
      });

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