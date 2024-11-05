//where the game is played
import React, {useState} from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_GAME } from '../utils/queries'; 
import { QUERY_USERS } from '../utils/queries';
import { TicTacToe } from '../components/Games/Tictactoe/Tictactoe';
import { useMutation } from '@apollo/client';
import { DELETE_GAME, UPDATE_GAME } from '../utils/mutations';
import Auth from '../utils/auth';
//import { Selection } from '../components/Games/Selection';
const GameRoom = () => {
  // 1. All hooks must be at the top
  const [opponentUsers, setOpponent] = useState([]);
  const [opponentUser, setOpponentUser] = useState('');
  const navigate = useNavigate();
  const [deleteGame] = useMutation(DELETE_GAME);
  const [updateGame] = useMutation(UPDATE_GAME, {
    onError: (error) => {
      console.log('Update Game Error:', error);
    }
  });
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const gameParam = queryParams.get('game')?.trim();
  
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

  // 2. Helper functions
  const addOpponent = () => {
    if (opponentUser) {
      setOpponent([...opponentUsers, opponentUser]);
      setOpponentUser('');
    }
  }

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

  const handleExitGame = async () => {
    try {
      const token = Auth.getToken();
      if (!token) {
        console.error('No token found');
        return;
      }

      const userId = Auth.getProfile().data._id;
      console.log('Current userId:', userId);
      console.log('Host userId:', game.hostUser._id);
      console.log('Game ID to delete:', gameParam);

      if (userId === game.hostUser._id) {
        const { data } = await deleteGame({
          variables: { 
            _id: gameParam  
          },
          refetchQueries: ['GetGames']
        });
        console.log('Delete game response:', data);
        navigate('/lobby');
      } 
 
      else if (userId === game.opponentUser._id) {
        console.log('Updating game with:', {
          gameData: {
            _id: gameParam,
            lobbyName: game.lobbyName,
            gamesSelection: game.gamesSelection,
            hostUser: game.hostUser._id,
            opponentUser: null,
            status: "WAITING",
            gameState: game.gameState
          }
        });
        
        await updateGame({
          variables: { 
            gameData: {
              _id: gameParam,
              lobbyName: game.lobbyName,
              gamesSelection: game.gamesSelection,
              hostUser: game.hostUser._id,
              opponentUser: null,
              status: "WAITING",
              gameState: game.gameState
            }
          }
        });
        navigate('/lobby');
      } else {
        console.error('You are not a participant in this game');
      }
    } catch (err) {
      console.error('Error exiting game:', err);
      console.error('Full error object:', JSON.stringify(err, null, 2));
      alert('Failed to exit game. Please try again.');
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px'
      }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h1>Game Room: {game.lobbyName}</h1>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h2>Game: {game.gamesSelection}</h2>
        </div>
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-evenly', 
        alignItems: 'center', 
        width: '100%' 
      }}>
        <h2 style={{color: 'green'}}>{game.hostUser?.firstName}</h2>
        <h2>vs</h2>
        <h2 style={{color: 'red'}}>
          {game.opponentUser ? game.opponentUser.firstName : 'Waiting for opponent...'}
        </h2> 
      </div>
      <TicTacToe />
       <button onClick={handleExitGame}>Exit Game</button>
    </div>
  );
};

export default GameRoom;