import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { characterName, gameLength, narrative } = req.body;
    const prompt = `Character: ${characterName}, Game Length: ${gameLength}, Narrative(this may start empty): ${narrative}. 
    Please respond with the game state in JSON format, including narrative, two actions (A and B), and inventory items. Continue the game narrative.
    you may also throw D20 dices for each response.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: prompt }],
      });
      
      console.log(JSON.stringify(response));      

      const content = JSON.parse(response.choices[0].message.content);
      const gameState = {
        narrative: content.narrative,
        actions: content.actions,
        inventory: content.inventory
      };
      
      res.status(200).json(gameState);
    } catch (error) {
      console.error('Error in OpenAI API call:', error);
      res.status(500).json({ message: 'Error processing request' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
