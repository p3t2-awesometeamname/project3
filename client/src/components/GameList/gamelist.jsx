import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_GAMES } from '../../utils/queries';


const GameList = () => {
    const { loading, error, data } = useQuery(QUERY_GAMES);
    console.log(data);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    return (
      <div className="game-list">
        <h2>Available Games</h2>
        <div className="game-grid">
          {data.games.map((game) => (
            <div key={game._id} className="game-card">
              <h3>{game.lobbyName}</h3>
              <p>{game.gamesSelection}</p>
              <p className="host">{game.hostUser.firstName}</p>
              {/* <Link to={`/gamelobby/${game._id}`}>
              <button>Join Game</button>
            </Link> */}
              <a href={`./Gameroom?game=${game._id}`} >join game</a>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default GameList;
  