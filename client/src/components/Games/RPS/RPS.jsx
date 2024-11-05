import React, { useState } from 'react';
import './RPS.css';

const RPS = () => {
  const [user1Choice, setUser1Choice] = useState('');
  const [user2Choice, setUser2Choice] = useState('');
  const [result, setResult] = useState('');

  const choices = ['rock', 'paper', 'scissors'];

  const handleUser1Click = (choice) => {
    setUser1Choice(choice);
    if (user2Choice) {
      determineWinner(choice, user2Choice);
    }
  };

  const handleUser2Click = (choice) => {
    setUser2Choice(choice);
    if (user1Choice) {
      determineWinner(user1Choice, choice);
    }
  };

  const determineWinner = (user1, user2) => {
    if (user1 === user2) {
      setResult('It\'s a tie!');
    } else if (
      (user1 === 'rock' && user2 === 'scissors') ||
      (user1 === 'paper' && user2 === 'rock') ||
      (user1 === 'scissors' && user2 === 'paper')
    ) {
      setResult('User 1 wins!');
    } else {
      setResult('User 2 wins!');
    }
  };

  return (
    <div>
      <h1>Rock Paper Scissors</h1>
      <div>
        <h2>User 1</h2>
        {choices.map((choice) => (
          <button key={choice} onClick={() => handleUser1Click(choice)}>
            {choice}
          </button>
        ))}
      </div>
      <div>
        <h2>User 2</h2>
        {choices.map((choice) => (
          <button key={choice} onClick={() => handleUser2Click(choice)}>
            {choice}
          </button>
        ))}
      </div>
      {user1Choice && <p>User 1's choice: {user1Choice}</p>}
      {user2Choice && <p>User 2's choice: {user2Choice}</p>}
      {result && <p>{result}</p>}
    </div>
  );
};

export default RPS;