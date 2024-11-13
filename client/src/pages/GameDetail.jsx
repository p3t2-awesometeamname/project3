import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_GAME_RESULT } from '../utils/queries';
import './GameDetail.css';

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(QUERY_GAME_RESULT, {
    variables: { _id: id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const result = data.gameResult;

  return (
    <div className="game-detail-container">
      <div className="game-detail-card">
        <h2>Game Results</h2>
        <p>Game Type: {result.gameType}</p>
        <p>Winning Player: {result.winningPlayer ? `${result.winningPlayer.firstName} ${result.winningPlayer.lastName}` : 'N/A'}</p>
        <p>Losing Player: {result.losingPlayer ? `${result.losingPlayer.firstName} ${result.losingPlayer.lastName}` : 'N/A'}</p>
        <p>Draw: {result.draw ? 'Yes' : 'No'}</p>
        {/* <p>Date: {new Date(result.date).toLocaleDateString()}</p> */}
      </div>
      <button className="back-button" onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  );
};

export default GameDetail;