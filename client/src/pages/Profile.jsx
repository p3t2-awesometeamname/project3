import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { QUERY_GAME_RESULTS } from '../utils/queries';
import Auth from '../utils/auth';
import './Profile.css';

const Profile = () => {
  const { loading, error, data } = useQuery(QUERY_GAME_RESULTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const gameResults = data.gameResults;

  // Get the current user's ID
  const user = Auth.getProfile();
  const userId = user.data._id;

  // Filter game results for the logged-in user
  const userGameResults = gameResults.filter(
    (result) =>
      (result.winningPlayer === null || result.losingPlayer === null) ? 
      (result.draw && result.players.some(player => player._id === userId)) : 
      (result.winningPlayer._id === userId || result.losingPlayer._id === userId || result.players.some(player => player._id === userId))
  );

  return (
    <div className="profile-container">
      <h1>Game History: {user.data.firstName} {user.data.lastName}</h1>
      <div className="game-history-grid">
        {userGameResults.map((result) => (
          <div key={result._id} className="game-history-card">
            <Link to={`/GameDetail/${result._id}`}>
              <div className="game-history-content">
                <p><strong>Game Type:</strong> {result.gameType}</p>
                {result.draw ? (
                  <>
                    <p><strong>Result: Draw</strong></p>
                    <p><strong>Players:</strong> {result.players.map(player => `${player.firstName} ${player.lastName}`).join(', ')}</p>
                  </>
                ) : (
                  <>
                    <p><strong>Winning Player:</strong> {result.winningPlayer ? `${result.winningPlayer.firstName} ${result.winningPlayer.lastName}` : 'N/A'}</p>
                    <p><strong>Losing Player:</strong> {result.losingPlayer ? `${result.losingPlayer.firstName} ${result.losingPlayer.lastName}` : 'N/A'}</p>
                  </>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;