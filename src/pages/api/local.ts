const axios = require('axios');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { characterName, gameLength, narrative } = req.body;
    const prompt = `Character: ${characterName}, Game Length: ${gameLength}, Narrative(this may start empty): ${narrative}. 
    Please respond with the game state in JSON format, including narrative, two actions "A" and "B". 
    
    here is an example for the prompt:
    {\n  \"narrative\": \"You wake up in a dimly lit room with no memory of how you got here. As you take in your surroundings, you notice a door on one side. What will you do?\",\n  \"actions\": {\n    \"A\": \"Inspect the door\",\n    \"B\": \"Investigate the table\"\n  },\n  \"inventory\": []\n}"}
    
    important: Use JSON only in your response, nothing else.`;

    try {
      const data = {
        messages: [
          { role: 'system', content: prompt }
        ],
        model: 'gpt-3.5-turbo'
      };

      const response = await axios.post('http://localhost:1234/v1/chat/completions', data, {
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers you need here
        },
      });

      console.log(JSON.stringify(response.data));

      const content = JSON.parse(response.data.choices[0].message.content);
      const gameState = {
        narrative: content.narrative,
        actions: content.actions,
        inventory: content.inventory
      };

      res.status(200).json(gameState);
    } catch (error) {
      console.error('Error in Axios POST request:', error);
      res.status(500).json({ message: 'Error processing request' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
