import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_GAMES, UPDATE_GAME_OPPONENT } from '../../utils/queries';
import { useNavigate } from 'react-router-dom';
import './GameList.css';
import Auth from '../../utils/auth';

const GameList = () => {
  const { loading, error, data } = useQuery(QUERY_GAMES);
  const [updateGameOpponent] = useMutation(UPDATE_GAME_OPPONENT);
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: 'lobbyName', direction: 'ascending' });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const games = data.games;

  // Filter out duplicate games
  const uniqueGames = Array.from(new Set(games.map(game => game._id)))
    .map(id => games.find(game => game._id === id));

  const sortedGames = [...uniqueGames].sort((a, b) => {
    const valueA = a[sortConfig.key]?.toString().toLowerCase();
    const valueB = b[sortConfig.key]?.toString().toLowerCase();
    if (valueA < valueB) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

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

      navigate(`/Gameroom?game=${gameId}`);
    } catch (err) {
      console.error('Error joining game:', err);
    }
  };

  return (
    <div className="game-list">
      <div className="game-list-header">
        <div className="table-header">
          <div className="table-cell" onClick={() => requestSort('lobbyName')}>Lobby Name</div>
          <div className="table-cell" onClick={() => requestSort('gamesSelection')}>Game Type</div>
          <div className="table-cell" onClick={() => requestSort('hostUser')}>Host</div>
          <div className="table-cell">Action</div>
        </div>
      </div>
      <div className="game-list-body">
        <div className="table-body">
          {sortedGames.map((game) => (
            <div key={game._id} className="table-row">
              <div className="table-cell">{game.lobbyName}</div>
              <div className="table-cell">{game.gamesSelection}</div>
              <div className="table-cell">{game.hostUser.firstName}</div>
              <div className="table-cell">
                <button onClick={() => handleJoinGame(game._id, game.hostUser._id)}>Join Game</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameList;