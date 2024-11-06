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
    (result) => result.winningPlayer._id === userId || result.losingPlayer._id === userId || result.players.some(player => player._id === userId)
  );

  return (
    <div className="profile-container">
      <h1>Welcome, {user.data.firstName}!</h1>
      <ul className="game-results-list">
        {userGameResults.map((result) => (
          <li key={result._id} className="game-result-card">
            <Link to={`/GameDetail/${result._id}`}>
              <div className="game-result-content">
                <p>Game Type: {result.gameType}</p>
                <p>Players:</p>
                <ul>
                {result.players && result.players.map(player => (
                    <li key={player._id}>{player.firstName} {player.lastName}</li>
                  ))}
                </ul>
                
             
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;