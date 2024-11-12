import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { QUERY_GAME_RESULTS } from '../../utils/queries';
import './GameHistory.css';

const GameHistory = () => {
  const { loading, error, data } = useQuery(QUERY_GAME_RESULTS);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const gameResults = data.gameResults;

  const sortedResults = [...gameResults].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (isNaN(dateA) || isNaN(dateB)) return 0; // Handle invalid dates
      return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
    } else if (sortConfig.key === 'winningPlayer') {
      const winnerA = a.winningPlayer ? `${a.winningPlayer.firstName} ${a.winningPlayer.lastName}`.toLowerCase() : '';
      const winnerB = b.winningPlayer ? `${b.winningPlayer.firstName} ${b.winningPlayer.lastName}`.toLowerCase() : '';
      if (winnerA < winnerB) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (winnerA > winnerB) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    } else {
      const valueA = a[sortConfig.key]?.toString().toLowerCase();
      const valueB = b[sortConfig.key]?.toString().toLowerCase();
      if (valueA < valueB) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    }
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="game-history">
      <div className="game-history-header">
        <div className="table-header">
          <div className="table-cell" onClick={() => requestSort('gameType')}>Game Type</div>
          <div className="table-cell" onClick={() => requestSort('winningPlayer')}>Winner</div>
          <div className="table-cell" onClick={() => requestSort('players')}>Players</div>
          <div className="table-cell" onClick={() => requestSort('date')}>Date</div>
        </div>
      </div>
      <div className="game-history-body">
        <div className="table-body">
          {sortedResults.map((result) => (
            <Link to={`/GameDetail/${result._id}`} key={result._id} className="table-row">
              <div className="table-cell">{result.gameType}</div>
              <div className="table-cell">
                {result.draw ? 'Draw' : result.winningPlayer ? `${result.winningPlayer.firstName} ${result.winningPlayer.lastName}` : 'N/A'}
              </div>
              <div className="table-cell">
                {result.players.map(player => `${player.firstName} ${player.lastName}`).join(', ')}
              </div>
              <div className="table-cell">{new Date(result.date).toLocaleDateString()}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameHistory;