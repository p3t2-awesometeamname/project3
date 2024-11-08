import React, { useState } from 'react';
import './ConnectFour.css';

const ROWS = 6;
const COLS = 7;

const ConnectFour = () => {
  const [board, setBoard] = useState(Array(ROWS).fill(Array(COLS).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('Red');
  const [winner, setWinner] = useState(null);

  const handleClick = (col) => {
    if (winner) return;

   
    const newBoard = board.map(row => row.slice());
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = currentPlayer;
        break;
      }
    }

    
    setBoard(newBoard);

    // Check for a winner
    if (checkWinner(newBoard)) {
      setWinner(currentPlayer);
    } else {
      // Switch players
      setCurrentPlayer(currentPlayer === 'Red' ? 'Yellow' : 'Red');
    }
  };

  const checkWinner = (board) => {
    // Check for a winner (horizontal, vertical, diagonal)
    // Implementation omitted for brevity
    return false;
  };

  return (
    <div className="connect-four">
      <h1>Connect Four</h1>
      {winner && <h2>{winner} wins!</h2>}
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell}`}
                onClick={() => handleClick(colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectFour;
