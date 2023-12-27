import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Container, Text, Button } from '@nextui-org/react';

export default function Game() {
  const router = useRouter();
  const { gameLength, characterName } = router.query;
  const [gameState, setGameState] = useState({
    narrativeHistory: '',
    currentNarrative: '',
    actions: { A: '', B: '' },
    inventory: [],
  });

  const fetchGameState = async (actionKey) => {
    const actionNarrative = actionKey ? `Player chose to: ${gameState.actions[actionKey]}` : '';
    const fullNarrative = gameState.narrativeHistory + ' ' + gameState.currentNarrative + ' ' + actionNarrative;
    try {
      const response = await fetch('/api/openai-api', { // use "/api/openai-api" or "/api/local"
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterName, gameLength, narrative: fullNarrative })
      });

      const data = await response.json();
      setGameState({
        ...gameState,
        narrativeHistory: fullNarrative,
        currentNarrative: data.narrative,
        actions: data.actions,
        inventory: data.inventory
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (gameLength && characterName) {
      fetchGameState(null); // Initial game state request
    }
  }, [gameLength, characterName]);

  const handleAction = (actionKey) => {
    fetchGameState(actionKey);
  };

  return (
    <Container>
      <Text h1>Adventure Begins</Text>
      <Text>{gameState.currentNarrative}</Text>
      <div style={{display: "flex"}}>
      <Button onClick={() => handleAction('A')}>Action A: {gameState.actions.A}</Button>
      <Button onClick={() => handleAction('B')}>Action B: {gameState.actions.B}</Button>
      </div>
      {/* { gameState.inventory &&
        <Text>Inventory: {gameState.inventory.join(', ')}</Text>
      } */}
    </Container>
  );
}
