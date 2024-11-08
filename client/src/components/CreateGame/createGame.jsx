import { useState } from 'react';
import './CreateGame.css';
import { useMutation } from '@apollo/client';
import { CREATE_GAME } from '../../utils/mutations';
import AuthServices from '../../utils/auth';

const CreateGame = () => {
  const [lobbyName, setLobbyName] = useState('');
  const [gameType, setGameType] = useState('tic-tac-toe');
  const [createGame] = useMutation(CREATE_GAME);

  const handleLobbyNameChange = (e) => {
    setLobbyName(e.target.value);
  };
  
  const handleGameTypeChange = (e) => {
    setGameType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(AuthServices.getProfile().data)
    console.log(`Lobby Name: ${lobbyName}, Game Type: ${gameType}`);
    // Add logic to start the game
    const mutationResponse = await createGame({
        variables: {
          gameData: {
          hostUser: AuthServices.getProfile().data,
          opponentUser: null,
          gamesSelection: gameType,
          lobbyName: lobbyName,
          }
        },
      });
     //START GAME LOGIC

      console.log(mutationResponse);

    // Clear the form
    setLobbyName('');
    setGameType('tic-tac-toe');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Lobby Name:
          <input type="text" value={lobbyName} onChange={handleLobbyNameChange} required />
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="tic-tac-toe"
            checked={gameType === 'tic-tac-toe'}
            onChange={handleGameTypeChange}
          />
          Tic Tac Toe
        </label>
        <label>
          <input
            type="radio"
            value="connect-four"
            checked={gameType === 'connect-four'}
            onChange={handleGameTypeChange}
          />
          Connect Four
        </label>
      </div>
      <button type="submit">Start Game</button>
    </form>
  );
};

export default CreateGame;