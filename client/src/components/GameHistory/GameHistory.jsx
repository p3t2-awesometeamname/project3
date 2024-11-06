import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { QUERY_GAME_RESULTS } from '../../utils/queries';
import './GameHistory.css';

const GameHistory = () => {
  const { loading, error, data } = useQuery(QUERY_GAME_RESULTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const gameResults = data.gameResults;

  return (
    <div className="game-history">
      <h2>Game History</h2>
      <ul>
        {gameResults.map((result) => (
          <li key={result._id}>
            <Link to={`/GameDetail/${result._id}`}>
              <p>Game Type: {result.gameType}</p>
              <p>Winning Player: {result.winningPlayer ? `${result.winningPlayer.firstName} ${result.winningPlayer.lastName}` : 'N/A'}</p>
              <p>Losing Player: {result.losingPlayer ? `${result.losingPlayer.firstName} ${result.losingPlayer.lastName}` : 'N/A'}</p>
              <p>Draw: {result.draw ? 'Yes' : 'No'}</p>
              <p>Date: {new Date(result.date).toLocaleDateString()}</p>
              <p>Additional Info: {result.additionalInfo}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameHistory;