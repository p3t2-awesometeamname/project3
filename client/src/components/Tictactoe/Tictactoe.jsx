import React, { useState } from 'react';
import './Tictactoe.module.css';

function TicTacToe({ defaultBoard = Array(9).fill(null), defaultXIsNext = true }) {
  const [board, setBoard] = useState(defaultBoard);
  const [xIsNext, setXIsNext] = useState(defaultXIsNext);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], // horizontal
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6], // vertical
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8], // diagonal
      [2, 4, 6],
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (calculateWinner(board) || board[i]) {
      return;
    }
    
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const winner = calculateWinner(board);
  const status = winner 
    ? `Winner: ${winner}`
    : board.every(square => square) 
    ? "Game is a draw!" 
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="game">
      <div className="status">{status}</div>
      <div className="board">
        {board.map((square, i) => (
          <button
            key={i}
            className="square"
            onClick={() => handleClick(i)}
          >
            {square}
          </button>
        ))}
      </div>
      <button className="reset" onClick={resetGame}>
        Reset Game
      </button>

      <style >{`
        .game {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 20px;
        }
        .board {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
      `}</style>
    </div>
  );
}

export default TicTacToe;
