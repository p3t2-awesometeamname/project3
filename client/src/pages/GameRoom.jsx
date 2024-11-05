//where the game is played
import React, {useState} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_GAME } from '../utils/queries'; 
import { QUERY_USERS } from '../utils/queries';
import { TicTacToe } from '../components/Games/Tictactoe/Tictactoe';
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
      <h2>Game Selection: {game.gameSelection}</h2>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-evenly', 
        alignItems: 'center', 
        width: '100%' 
      }}>
        <h2 style={{color: 'green'}}>{game.hostUser.firstName}</h2>
        <h2>vs</h2>
        <h2 style={{color: 'red'}}>{game.opponentUser.firstName}</h2> 
      </div>
      <TicTacToe />
    </div>
  );
};

export default GameRoom;