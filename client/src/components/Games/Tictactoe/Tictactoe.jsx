import React, { useState, useEffect } from 'react';
import './Tictactoe.css';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_GAME } from '../../../utils/mutations';
import { QUERY_GAME } from '../../../utils/queries';
import Auth from '../../../utils/auth';

function TicTacToe({ game }) {
  // Initialize board safely
  const initializeBoard = (gameBoard) => {
    if (!gameBoard) return Array(9).fill(null);
    if (Array.isArray(gameBoard)) return gameBoard;
    try {
      return JSON.parse(gameBoard);
    } catch {
      return Array(9).fill(null);
    }
  };

  const [board, setBoard] = useState(initializeBoard(game?.gameBoard));
  const [gameStatus, setGameStatus] = useState(game?.gameStatus || "waiting");
  const [isYourTurn, setIsYourTurn] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [updateGame] = useMutation(UPDATE_GAME);

  // Add polling query using QUERY_GAME
  const { data: gameData, loading } = useQuery(QUERY_GAME, {
    variables: { id: game._id },
    pollInterval: 1000,
    skip: !game?._id,
    fetchPolicy: 'no-cache',
    onError: (error) => console.error('Polling error:', error)
  });

  // Update local state when new data comes in
  useEffect(() => {
    if (gameData?.game) {
      try {
        // Initialize gameBoard safely
        const gameBoard = initializeBoard(gameData.game.gameBoard);
        
        const currentUserId = Auth.getProfile().data._id;
        const isHost = gameData.game.hostUser?._id === currentUserId;
        const isOpponent = gameData.game.opponentUser?._id === currentUserId;
        
        setBoard(gameBoard);
        setGameStatus(gameData.game.gameStatus);
        setPlayerSymbol(isHost ? 'X' : isOpponent ? 'O' : null);
        
        // Calculate turns
        const xCount = gameBoard.filter(cell => cell === 'X').length;
        const oCount = gameBoard.filter(cell => cell === 'O').length;
        const isXTurn = xCount === oCount;
        setIsYourTurn((isHost && isXTurn) || (isOpponent && !isXTurn));
      } catch (error) {
        console.error('Error processing game data:', error);
      }
    }
  }, [gameData]);

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

  const handleClick = async (i) => {
    if (calculateWinner(board) || board[i] || !isYourTurn) {
      return;
    }

    const newBoard = [...board];
    newBoard[i] = playerSymbol;
    
    // console.log('Move made:', {
    //   position: i,
    //   symbol: playerSymbol,
    //   newBoard,
    //   nullSquares: newBoard.filter(square => square === null).length
    // });

    const variables = {
      _id: game._id,
      gameData: {
        gameBoard: newBoard,
        gameStatus: 'in_progress',
        lobbyName: game.lobbyName,
        gamesSelection: game.gamesSelection
      }
    };

    try {
      const response = await updateGame({
        variables
      });
      
      // console.log('Server response:', response);
      setBoard(newBoard);
      setIsYourTurn(false);
    } catch (err) {
      console.error('Error updating game:', err);
    }
  };

  const resetGame = async () => {
    try {
      await updateGame({
        variables: {
          _id: game._id,
          gameData: {
            gameBoard: JSON.stringify(Array(9).fill(null)),
            gameStatus: 'in_progress',
            lobbyName: game.lobbyName,
            gamesSelection: game.gamesSelection
          }
        }
      });
      setBoard(Array(9).fill(null));
      setGameStatus('in_progress');
    } catch (err) {
      console.error('Error updating game:', err);
    }
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null);
  const isGameOver = winner || isDraw;

  // Add debugging logs
  // console.log('Game State:', {
  //   board,
  //   winner,
  //   isDraw,
  //   isGameOver,
  //   nullCount: board.filter(square => square === null).length
  // });

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
        <button className="reset" onClick={() => resetGame()}>
          Start Game
        </button>
      )}
      
      {/* Add visual debug info
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <pre>
          Board: {JSON.stringify(board, null, 2)}
        </pre>
      </div> */}

      <style>{`
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