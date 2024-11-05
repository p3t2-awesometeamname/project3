import React, { useState, useEffect } from 'react';
import './RPS.css';
import { io } from 'socket.io-client';

const RPS = () => {
  const [user1Choice, setUser1Choice] = useState('');
  const [opponentChoice, setOpponentChoice] = useState('');
  const [result, setResult] = useState('');
  const [gameId, setGameId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [user1Score, setUser1Score] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isHost, setIsHost] = useState(true); // Assuming the initial user is the host

  useEffect(() => {
    // Connect to websocket server
    const newSocket = io('/socket.io');
    setSocket(newSocket);

    // Listen for game events
    newSocket.on('gameJoined', ({ gameId, user2 }) => {
      setGameId(gameId);
      setIsHost(user2 !== ''); // If user2 is not empty, the current user is the host
    });

    newSocket.on('moveMade', ({ user1Choice, opponentChoice }) => {
      setUser1Choice(user1Choice);
      setOpponentChoice(opponentChoice);
      determineWinner(user1Choice, opponentChoice);
    });

    return () => newSocket.disconnect();
  }, []);

  const choices = ['rock', 'paper', 'scissors'];

  const handleUser1Click = (choice) => {
    setUser1Choice(choice);
    socket.emit('makeMove', { gameId, user1Choice: choice });
  };

  const handleOpponentClick = (choice) => {
    setOpponentChoice(choice);
    socket.emit('makeMove', { gameId, opponentChoice: choice });
  };

  const determineWinner = (user1, opponent) => {
    if (user1 === opponent) {
      setResult('It\'s a tie!');
    } else if (
      (user1 === 'rock' && opponent === 'scissors') ||
      (user1 === 'paper' && opponent === 'rock') ||
      (user1 === 'scissors' && opponent === 'paper')
    ) {
      setResult('User 1 wins this round!');
      setUser1Score(user1Score + 1);
    } else {
      setResult('Opponent wins this round!');
      setOpponentScore(opponentScore + 1);
    }
    setRound(round + 1);
    setUser1Choice('');
    setOpponentChoice('');
  };

  const resetGame = () => {
    setUser1Score(0);
    setOpponentScore(0);
    setRound(1);
    setResult('');
    setUser1Choice('');
    setOpponentChoice('');
  };

  return (
    <div className="container">
      <h1>Rock Paper Scissors</h1>
      {isHost ? (
        <div>
          <h2>Host (User 1)</h2>
          {choices.map((choice) => (
            <button key={choice} onClick={() => handleUser1Click(choice)} disabled={!!user1Choice}>
              {choice}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <h2>Opponent</h2>
          {choices.map((choice) => (
            <button key={choice} onClick={() => handleOpponentClick(choice)} disabled={!!opponentChoice}>
              {choice}
            </button>
          ))}
        </div>
      )}
      {user1Choice && opponentChoice && (
        <>
          <p>Host (User 1)'s choice: {user1Choice}</p>
          <p>Opponent's choice: {opponentChoice}</p>
          <p>{result}</p>
        </>
      )}
      <div>
        <h2>Score</h2>
        <p>User 1: {user1Score}</p>
        <p>Opponent: {opponentScore}</p>
        <p>Round: {round}</p>
      </div>
      {(user1Score === 2 || opponentScore === 2) && (
        <div>
          <h2>{user1Score === 2 ? 'User 1 wins the game!' : 'Opponent wins the game!'}</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default RPS;
