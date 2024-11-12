import React, { useState, useEffect } from 'react';
import './RPS.css';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_GAME } from '../../../utils/mutations';
import { QUERY_GAME } from '../../../utils/queries';
import Auth from '../../../utils/auth';

const CHOICE_EMOJIS = {
  rock: '🥌',
  paper: '📄',
  scissors: '✂️'
};

function RPS({ game }) {
  const [selectedChoice, setSelectedChoice] = useState('');
  const [confirmedChoice, setConfirmedChoice] = useState(false);
  const [scores, setScores] = useState(() => {
    const initialScores = {
      [game.hostUser._id]: { wins: 0, ties: 0 }
    };
    if (game.opponentUser) {
      initialScores[game.opponentUser._id] = { wins: 0, ties: 0 };
    }
    return initialScores;
  });
  const [updateGame] = useMutation(UPDATE_GAME);
  const currentUser = Auth.getProfile().data._id;

  const { data: gameData } = useQuery(QUERY_GAME, {
    variables: { id: game._id },
    pollInterval: 1000,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (gameData?.game?.opponentUser && !scores[gameData.game.opponentUser._id]) {
      setScores(prevScores => ({
        ...prevScores,
        [gameData.game.opponentUser._id]: { wins: 0, ties: 0 }
      }));
    }
  }, [gameData?.game?.opponentUser]);

  useEffect(() => {
    const currentGameBoard = gameData?.game?.gameBoard || [];
    if (currentGameBoard.length === 2 && 
        currentGameBoard[0] !== '' && 
        currentGameBoard[1] !== '') {
      const winner = getWinner(currentGameBoard[0], currentGameBoard[1]);
      if (winner === 'tie') {
        setScores(prevScores => ({
          [gameData.game.hostUser._id]: {
            ...prevScores[gameData.game.hostUser._id],
            ties: prevScores[gameData.game.hostUser._id].ties + 1
          },
          [gameData.game.opponentUser._id]: {
            ...prevScores[gameData.game.opponentUser._id],
            ties: prevScores[gameData.game.opponentUser._id].ties + 1
          }
        }));
      } else {
        const winnerId = winner === 'host' ? gameData.game.hostUser._id : gameData.game.opponentUser._id;
        setScores(prevScores => ({
          ...prevScores,
          [winnerId]: {
            ...prevScores[winnerId],
            wins: prevScores[winnerId].wins + 1
          }
        }));
      }
    }
    if (currentGameBoard.length === 2 && 
        currentGameBoard[0] === '' && 
        currentGameBoard[1] === '') {
      setSelectedChoice('');
      setConfirmedChoice(false);
    }
  }, [gameData?.game?.gameBoard]);

  const getWinner = (hostChoice, opponentChoice) => {
    if (hostChoice === opponentChoice) return 'tie';
    
    const winningCombos = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper'
    };

    return winningCombos[hostChoice] === opponentChoice ? 'host' : 'opponent';
  };

  const currentGame = gameData?.game || game;
  const isHost = currentGame.hostUser?._id === currentUser;
  const playerIndex = isHost ? 0 : 1;

  const bothPlayersPresent = currentGame.hostUser && currentGame.opponentUser;
  const bothPlayersChose = currentGame.gameBoard?.length === 2 && 
    currentGame.gameBoard[0] !== '' && 
    currentGame.gameBoard[1] !== '';

  const playerChoice = currentGame.gameBoard?.[playerIndex];

  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice);
  };

  const handleConfirmChoice = async () => {
    if (!selectedChoice) return;
    
    setConfirmedChoice(true);
    
    const newGameBoard = [...(currentGame.gameBoard || ['', ''])];
    newGameBoard[playerIndex] = selectedChoice;

    try {
      await updateGame({
        variables: {
          _id: currentGame._id,
          gameData: {
            gameStatus: 'in_progress',
            gameBoard: newGameBoard,
          },
        },
      });
    } catch (error) {
      console.error('Error updating game:', error);
    }
  };

  const handleNewRound = async () => {
    try {
      await updateGame({
        variables: {
          _id: currentGame._id,
          gameData: {
            gameStatus: 'in_progress',
            gameBoard: ['', ''],
          },
        },
      });
      setSelectedChoice('');
      setConfirmedChoice(false);
    } catch (error) {
      console.error('Error starting new round:', error);
    }
  };

  if (loading) return <div>Loading game...</div>;
  if (!game) return <div>No game data available</div>;

  const status = result || (isYourTurn ? 'Your turn' : 'Waiting for opponent...');

  return (
    <div className="container">
      <h1>Rock Paper Scissors</h1>
      
      <div className="score-board">
        <div className="score-card">
          <h3>{currentGame.hostUser.firstName}</h3>
          <p>Wins: {scores[currentGame.hostUser._id].wins}</p>
          <p>Ties: {scores[currentGame.hostUser._id].ties}</p>
        </div>
        {currentGame.opponentUser && (
          <div className="score-card">
            <h3>{currentGame.opponentUser.firstName}</h3>
            <p>Wins: {scores[currentGame.opponentUser._id].wins}</p>
            <p>Ties: {scores[currentGame.opponentUser._id].ties}</p>
          </div>
        )}
      </div>

      {!bothPlayersPresent && (
        <div>Waiting for opponent to join...</div>
      )}

      {bothPlayersPresent && !bothPlayersChose && (
        <div>
          <h2>{isHost ? 'Host' : 'Opponent'}</h2>
          {!playerChoice ? (
            <div>
              <div className="choices">
                {['rock', 'paper', 'scissors'].map((choice) => (
                  <button 
                    key={choice} 
                    onClick={() => handleChoiceSelect(choice)}
                    className={selectedChoice === choice ? 'selected' : ''}
                    disabled={confirmedChoice}
                  >
                    {choice} {CHOICE_EMOJIS[choice]}
                  </button>
                ))}
              </div>
              {selectedChoice && !confirmedChoice && (
                <button 
                  className="confirm-button"
                  onClick={handleConfirmChoice}
                >
                  Confirm {selectedChoice} {CHOICE_EMOJIS[selectedChoice]}
                </button>
              )}
            </div>
          ) : (
            <div>Waiting for other player to choose...</div>
          )}
        </div>
      )}

      {bothPlayersChose && (
        <div className="results">
          <h2>Results:</h2>
          <div className="choices-reveal">
            <p>{currentGame.hostUser.firstName} chose: {currentGame.gameBoard[0]} {CHOICE_EMOJIS[currentGame.gameBoard[0]]}</p>
            <p>{currentGame.opponentUser.firstName} chose: {currentGame.gameBoard[1]} {CHOICE_EMOJIS[currentGame.gameBoard[1]]}</p>
          </div>
          <div className="winner-announcement">
            {determineWinner(
              currentGame.gameBoard[0], 
              currentGame.gameBoard[1], 
              currentGame.hostUser.firstName, 
              currentGame.opponentUser.firstName
            )}
          </div>
          <button 
            className="new-round-button"
            onClick={handleNewRound}
          >
            Start New Round
          </button>
        </div>
      )}
    </div>
  );
}

function determineWinner(hostChoice, opponentChoice, hostName, opponentName) {
  // Only determine winner if both choices are present
  if (!hostChoice || !opponentChoice) {
    return null;
  }

  if (hostChoice === opponentChoice) {
    return <p>It's a tie!</p>;
  }

  const winningCombos = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
  };

  if (winningCombos[hostChoice] === opponentChoice) {
    return <p>{hostName} wins!</p>;
  } else {
    return <p>{opponentName} wins!</p>;
  }
}

export { RPS };