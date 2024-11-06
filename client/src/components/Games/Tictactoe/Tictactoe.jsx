import React, { useState, useEffect } from 'react';
import './Tictactoe.css';

function TicTacToe({ defaultBoard = Array(9).fill(null), defaultXIsNext = true }) {
  const [board, setBoard] = useState(defaultBoard);
  const [xIsNext, setXIsNext] = useState(defaultXIsNext);
  const [gameId, setGameId] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [isYourTurn, setIsYourTurn] = useState(false);

  useEffect(() => {
    // Initial game join
    fetch('/api/game/join')
      .then(res => res.json())
      .then(({ gameId, symbol }) => {
        setGameId(gameId);
        setPlayerSymbol(symbol);
        setIsYourTurn(symbol === 'X');
      });

    // Set up polling interval
    const pollInterval = setInterval(() => {
      if (gameId) {
        fetch(`/api/game/${gameId}/state`)
          .then(res => res.json())
          .then(({ board, nextTurn }) => {
            setBoard(board);
            setXIsNext(nextTurn);
            setIsYourTurn(nextTurn ? playerSymbol === 'X' : playerSymbol === 'O');
          });
      }
    }, 1000); // Poll every second

    return () => clearInterval(pollInterval);
  }, [gameId, playerSymbol]);

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
    if (calculateWinner(board) || board[i] || !isYourTurn) {
      return;
    }

    const newBoard = board.slice();
    newBoard[i] = playerSymbol;
    
    // Send move to server
    fetch(`/api/game/${gameId}/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        board: newBoard,
        position: i,
      }),
    });
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const winner = calculateWinner(board);
  const isDraw = board.every(square => square);
  const isGameOver = winner || isDraw;
  const status = winner 
    ? `Winner: ${winner}`
    : isDraw
    ? "Game is a draw!" 
    : !playerSymbol 
    ? "Waiting for opponent..."
    : isYourTurn 
    ? "Your turn" 
    : "Opponent's turn";

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
      {isGameOver && (
        <button className="reset" onClick={resetGame}>
          Reset Game
        </button>
      )}

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

export { TicTacToe };