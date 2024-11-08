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
      <div className="game-history-grid">
        {gameResults.map((result) => (
          <div key={result._id} className="game-history-card">
            <Link to={`/GameDetail/${result._id}`}>
              <div className="game-history-content">
                <p><strong>Game Type:</strong> {result.gameType}</p>
                <p><strong>Winning Player:</strong> {result.winningPlayer ? `${result.winningPlayer.firstName} ${result.winningPlayer.lastName}` : 'N/A'}</p>
                <p><strong>Losing Player:</strong> {result.losingPlayer ? `${result.losingPlayer.firstName} ${result.losingPlayer.lastName}` : 'N/A'}</p>
                <p><strong>Draw:</strong> {result.draw ? 'Yes' : 'No'}</p>
                <p><strong>Date:</strong> {new Date(result.date).toLocaleDateString()}</p>
                <p><strong>Additional Info:</strong> {result.additionalInfo}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHistory;