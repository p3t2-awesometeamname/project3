import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_GAMES, UPDATE_GAME_OPPONENT } from '../../utils/queries';
import { useNavigate } from 'react-router-dom';
import './GameList.css';
import Auth from '../../utils/auth';

const GameList = () => {
    const { loading, error, data } = useQuery(QUERY_GAMES);
    const [updateGameOpponent] = useMutation(UPDATE_GAME_OPPONENT);
    const navigate = useNavigate();
    console.log(data);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    const handleJoinGame = async (gameId, hostUserId) => {
      try {
        const currentUser = Auth.getProfile();
        
        if (currentUser.data._id === hostUserId) {
          console.log(`You are the host of this game. your ID is ${currentUser.data._id} and the host ID is ${hostUserId}`);
          setTimeout(() => {
            navigate(`/Gameroom?game=${gameId}`);
          }, 1000);
          return;
        }

        await updateGameOpponent({
          variables: { gameId }
        });
        console.log(`You are not the host of this game. your ID is ${currentUser.data._id} and the host ID is ${hostUserId}`);
        setTimeout(() => {
          navigate(`/Gameroom?game=${gameId}`);
        }, 1000);
      } catch (err) {
        console.error('Error joining game:', err);
      }
    };
  
    return (
      <div className="game-list">

        <div className="game-grid">
          {data.games
            .filter(game => {
              console.log('Game opponent:', game.opponentUser);
              return game.opponentUser === null;
            })
            .map((game) => (
            <div key={game._id} className="game-card">
              <h3>{game.lobbyName}</h3>
              <p>{game.gamesSelection}</p>
              <p className="host">{game.hostUser.firstName}</p>
              <button onClick={() => handleJoinGame(game._id, game.hostUser._id)}>Join Game</button>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default GameList;