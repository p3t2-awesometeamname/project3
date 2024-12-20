import { useState } from 'react';
import './createGame.css';
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
    try {
      console.log('Starting game creation...');
      const userData = AuthServices.getProfile().data;
      console.log('User data:', userData);

      const mutationResponse = await createGame({
        variables: {
          gameData: {
            hostUser: userData,
            opponentUser: null,
            gamesSelection: gameType,
            lobbyName: lobbyName,
          }
        },
      });

      console.log('Mutation response:', mutationResponse);

      if (mutationResponse?.data?.createGame) {
        const gameId = mutationResponse.data.createGame._id;
        console.log('Game ID:', gameId);
        
        window.location.replace(`/Gameroom?game=${gameId}`);
        
        setLobbyName('');
        setGameType('tic-tac-toe');
      } else {
        console.error('Invalid mutation response structure:', mutationResponse);
      }
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Lobby Name:
          <input type="text" value={lobbyName} onChange={handleLobbyNameChange} required />
        </label>
      </div>
      <div className="radio-group">
        <label className={gameType === 'tic-tac-toe' ? 'selected' : ''}>
          <input
            type="radio"
            value="tic-tac-toe"
            checked={gameType === 'tic-tac-toe'}
            onChange={handleGameTypeChange}
          />
          Tic Tac Toe
        </label>
        <label className={gameType === 'connect-four' ? 'selected' : ''}>
          <input
            type="radio"
            value="connect-four"
            checked={gameType === 'connect-four'}
            onChange={handleGameTypeChange}
          />
          Connect Four
        </label>
        <label className={gameType === 'rps' ? 'selected' : ''}>
          <input
            type="radio"
            value="rps"
            checked={gameType === 'rps'}
            onChange={handleGameTypeChange}
          />
          RPS
        </label>
      </div>
      <button type="submit">Start Game</button>
    </form>
  );
};

export default CreateGame;
