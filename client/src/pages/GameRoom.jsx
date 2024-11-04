//where the game is played
import React, {useState} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_GAME } from '../utils/queries'; 
import { QUERY_USERS } from '../utils/queries';
//import { Selection } from '../components/Games/Selection';
const GameRoom = () => {
  
  const [opponentUsers, setOpponent] = useState([]);
  const [opponentUser, setOpponentUser] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gameParam = queryParams.get('game')?.trim();
  
  console.log('Attempting to fetch game with ID:', gameParam);

  const {data, loading, error} = useQuery(QUERY_GAME, {
    variables: { id: gameParam },
    onCompleted: (data) => console.log('Query completed with data:', data),
    onError: (error) => {
      console.log('Query error details:', {
        message: error.message,
        networkError: error?.networkError?.result,
        graphQLErrors: error.graphQLErrors
      });
    }
  });

  // Add debugging for Apollo state
  console.log('Apollo query state:', { loading, error, data });

  if (!gameParam) return <p>Invalid game ID</p>;

  if (loading) return <p>Loading...</p>;
  if (error) {
    return (
      <div>
        <p>Error loading game:</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }
  
  const game = data?.game;
  if (!game) return <p>Game not found</p>;

  const addOpponent = () => {
    if (opponentUser) {
      setOpponent([...opponentUsers, opponentUser]);
      setOpponentUser('');
    }
  }
  return (
    <div>
      <h1>Game Room: {game.lobbyName}</h1>
      <div>
        <p>Game ID: {game._id}</p>
      </div>
      
      <input 
        type="text"
        value={opponentUser}
        onChange={(e) => setOpponentUser(e.target.value)}
        placeholder='Opponent User'
      />
      <button onClick={addOpponent}>Add User</button>
      <button>Start Game</button>

      <div>
        <h3>Opponents:</h3>
        <ul>
          {opponentUsers.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GameRoom;