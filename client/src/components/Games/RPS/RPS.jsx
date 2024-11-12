import React, { useState, useEffect } from 'react';
import './RPS.css';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_GAME } from '../../../utils/mutations';
import Auth from '../../../utils/auth';
import { QUERY_GAME } from '../../../utils/queries';

const RPS = ({ game }) => {
  const [user1Choice, setUser1Choice] = useState('');
  const [opponentChoice, setOpponentChoice] = useState('');
  const [result, setResult] = useState('');
  const [user1Score, setUser1Score] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isHost, setIsHost] = useState(false);
  const [isYourTurn, setIsYourTurn] = useState(false);

  const [updateGame] = useMutation(UPDATE_GAME);

  const { data: gameData, loading } = useQuery(QUERY_GAME, {
    variables: { id: game._id },
    pollInterval: 1000,
    skip: !game?._id,
    fetchPolicy: 'no-cache',
    onError: (error) => console.error('Polling error:', error),
  });

  useEffect(() => {
    if (gameData?.game) {
      try {
        const currentUserId = Auth.getProfile().data._id;
        const isHost = gameData.game.hostUser?._id === currentUserId;
        const isOpponent = gameData.game.opponentUser?._id === currentUserId;

        setIsHost(isHost);

        setUser1Choice(gameData.game.user1Choice || '');
        setOpponentChoice(gameData.game.opponentChoice || '');
        setUser1Score(gameData.game.user1Score || 0);
        setOpponentScore(gameData.game.opponentScore || 0);
        setRound(gameData.game.round || 1);

        setIsYourTurn((isHost && !gameData.game.user1Choice) || (isOpponent && !gameData.game.opponentChoice));
      } catch (error) {
        console.error('Error processing game data:', error);
      }
    }
  }, [gameData]);

  const choices = ['rock', 'paper', 'scissors'];

  const handleUser1Click = async (choice) => {
    setUser1Choice(choice);
    if (opponentChoice) {
      determineWinner(choice, opponentChoice);
    }

    try {
      await updateGame({
        variables: {
          _id: game._id,
          gameData: {
            user1Choice: choice,
            opponentChoice,
            user1Score,
            opponentScore,
            round,
          },
        },
      });
    } catch (error) {
      console.error('Error updating game:', error);
    }
  };

  const handleOpponentClick = async (choice) => {
    setOpponentChoice(choice);
    if (user1Choice) {
      determineWinner(user1Choice, choice);
    }

    try {
      await updateGame({
        variables: {
          _id: game._id,
          gameData: {
            user1Choice,
            opponentChoice: choice,
            user1Score,
            opponentScore,
            round,
          },
        },
      });
    } catch (error) {
      console.error('Error updating game:', error);
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

  const resetGame = async () => {
    try {
      await updateGame({
        variables: {
          _id: game._id,
          gameData: {
            user1Choice: '',
            opponentChoice: '',
            user1Score: 0,
            opponentScore: 0,
            round: 1,
          },
        },
      });
      setUser1Score(0);
      setOpponentScore(0);
      setRound(1);
      setResult('');
      setUser1Choice('');
      setOpponentChoice('');
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  };

  if (loading) return <div>Loading game...</div>;
  if (!game) return <div>No game data available</div>;

  const status = result || (isYourTurn ? 'Your turn' : 'Waiting for opponent...');

  return (
    <div className="container">
      <h1>Rock Paper Scissors</h1>
      <div className="status">{status}</div>
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