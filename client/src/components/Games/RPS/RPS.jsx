import React, { useState } from 'react';
import './RPS.css';

const RPS = () => {
  const [user1Choice, setUser1Choice] = useState('');
  const [opponentChoice, setOpponentChoice] = useState('');
  const [result, setResult] = useState('');
  const [user1Score, setUser1Score] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isHost, setIsHost] = useState(true); 

  const choices = ['rock', 'paper', 'scissors'];

  const handleUser1Click = (choice) => {
    setUser1Choice(choice);
    if (opponentChoice) {
      determineWinner(choice, opponentChoice);
    }
  };

  const handleOpponentClick = (choice) => {
    setOpponentChoice(choice);
    if (user1Choice) {
      determineWinner(user1Choice, choice);
    }
  };

  const determineWinner = (user1, opponent) => {
    let newResult = '';
    if (user1 === opponent) {
      newResult = 'It\'s a tie!';
    } else if (
      (user1 === 'rock' && opponent === 'scissors') ||
      (user1 === 'paper' && opponent === 'rock') ||
      (user1 === 'scissors' && opponent === 'paper')
    ) {
      newResult = 'User 1 wins this round!';
      setUser1Score(user1Score + 1);
    } else {
      newResult = 'Opponent wins this round!';
      setOpponentScore(opponentScore + 1);
    }
    setResult(newResult);
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
