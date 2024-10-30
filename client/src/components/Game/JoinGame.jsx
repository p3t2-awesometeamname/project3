import React, {useState} from "react";

export function JoinGame() {
  const [opponentUsername, setOpponentUsername] = useState("");

  const createChannel = () => {
    const response = client.queryUsers()

  };
  return (
    <div className="joinGame">
      <h1>create Game</h1>
      <input placeholder="username of oppenent" 
      onChange={(event) => {
        setOpponentUsername(event.target.value)}} />
        <button onClick= {createChannel}>Join/Start Game</button>
    </div>
   
  );
}