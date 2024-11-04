import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './Tictactoe.css';

function TicTacToe({ defaultBoard = Array(9).fill(null), defaultXIsNext = true }) {
  const [board, setBoard] = useState(defaultBoard);
  const [xIsNext, setXIsNext] = useState(defaultXIsNext);
  const [socket, setSocket] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [isYourTurn, setIsYourTurn] = useState(false);

  useEffect(() => {
    // Connect to websocket server
    const newSocket = io('/socket.io');
    setSocket(newSocket);

    // Listen for game events
    newSocket.on('gameJoined', ({ gameId, symbol }) => {
      setGameId(gameId);
      setPlayerSymbol(symbol);
      setIsYourTurn(symbol === 'X');
    });

    newSocket.on('moveMade', ({ board, nextTurn }) => {
      setBoard(board);
      setXIsNext(nextTurn);
      setIsYourTurn(nextTurn ? playerSymbol === 'X' : playerSymbol === 'O');
    });

    return () => newSocket.disconnect();
  }, []);

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
    
    // Emit move to server
    socket.emit('makeMove', {
      gameId,
      board: newBoard,
      position: i,
    });
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

export { TicTacToe };