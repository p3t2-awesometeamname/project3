//where the game is played
import React, {useState} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_GAME } from '../utils/queries'; 


const GameRoom = () => {
  
  const [oppenentUsers, setOppenent] = useState([]);
  const [oppenentUser, setOppenentUser] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gameParam = queryParams.get('game');
  console.log(gameParam);

  const {data, loading, error} = useQuery(QUERY_GAME, {
    variables: {id: gameParam}
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const game = data.game;


  const addOppenent = () => {
    if (oppenentUser) {
      setOppenent([...oppenentUsers, oppenentUser]);
      setOppenentUser('');
    }
  }
  return (
    <div>
      {/* <h1> put lobby name</h1> */}
      
      <input 
      type="text"
      value={oppenentUser}
      onChange={(e) => setOppenentUser(e.target.value)}
      placeholder='Opponent User'
     />
     <button onClick={addOppenent}>Add User</button>
     <button>Start Game</button>
    </div>
  );
};

export default GameRoom;