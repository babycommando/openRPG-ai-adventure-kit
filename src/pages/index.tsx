// pages/index.tsx
import { useState } from 'react';
import { Button, Container, Input, Text } from '@nextui-org/react';
import Link from 'next/link';

export default function Home() {
  const [gameSettings, setGameSettings] = useState({ gameLength: '', characterName: '' });

  const handleInputChange = (e) => {
    setGameSettings({ ...gameSettings, [e.target.name]: e.target.value });
  };

  return (
      <Container>
        <Text h1>Welcome to the RPG Game</Text>
        <Input
          clearable
          bordered
          label="Character Name"
          placeholder="Enter your character's name"
          name="characterName"
          onChange={handleInputChange}
        />
        <Input
          clearable
          bordered
          label="Game Length"
          placeholder="Short, Medium, Long"
          name="gameLength"
          onChange={handleInputChange}
        />
        <Link href={{ pathname: "/game", query: gameSettings }}>
          <Button>Start Game</Button>
        </Link>
      </Container>
  );
}
