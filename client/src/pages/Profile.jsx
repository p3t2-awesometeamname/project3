import React from 'react';
import { useQuery } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { QUERY_GAME_RESULTS } from '../utils/queries';
import Auth from '../utils/auth';
import './Profile.css';

const Profile = () => {
  const { loading, error, data } = useQuery(QUERY_GAME_RESULTS);
  const navigate = useNavigate();

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
      <div className="game-history">
        <div className="game-history-header">
          <div className="table-header">
            <div className="table-cell">Game Type</div>
            <div className="table-cell">Winner</div>
            <div className="table-cell">Players</div>
            {/* <div className="table-cell">Date</div> */}
          </div>
        </div>
        <div className="game-history-body">
          <div className="table-body">
            {userGameResults.map((result) => (
              <Link to={`/GameDetail/${result._id}`} key={result._id} className="table-row">
                <div className="table-cell">{result.gameType}</div>
                <div className="table-cell">
                  {result.draw ? 'Draw' : result.winningPlayer ? `${result.winningPlayer.firstName} ${result.winningPlayer.lastName}` : 'N/A'}
                </div>
                <div className="table-cell">
                  {result.players.map(player => `${player.firstName} ${player.lastName}`).join(', ')}
                </div>
                {/* <div className="table-cell">{new Date(result.date).toLocaleDateString()}</div> */}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="button-container">
        <button className="back-button" onClick={() => navigate('/')}>
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default Profile;