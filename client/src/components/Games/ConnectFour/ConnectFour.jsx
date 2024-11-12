import React, { useState, useEffect } from 'react';
import './ConnectFour.css';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_GAME, ADD_GAME_RESULT } from '../../../utils/mutations';
import { QUERY_GAME } from '../../../utils/queries';
import Auth from '../../../utils/auth';

const TOTAL_SPACES = 42; // 6 rows * 7 columns

// Move constants to the top level
const ROWS = 6;
const COLS = 7;

const initializeBoard = (gameBoard) => {
  const emptyBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  
  if (!gameBoard) {
    return emptyBoard;
  }
  
  try {
    if (Array.isArray(gameBoard)) {
      return gameBoard.length === ROWS && gameBoard.every(row => Array.isArray(row) && row.length === COLS)
        ? gameBoard
        : emptyBoard;
    }
    
    const parsed = JSON.parse(gameBoard);
    return Array.isArray(parsed) && parsed.length === ROWS && 
           parsed.every(row => Array.isArray(row) && row.length === COLS)
      ? parsed
      : emptyBoard;
  } catch (error) {
    console.error('Error parsing game board:', error);
    return emptyBoard;
  }
};

function ConnectFour({ game }) {
  const { data: gameData, loading } = useQuery(QUERY_GAME, {
    variables: { id: game?._id },
    pollInterval: 1000,
    skip: !game?._id,
    fetchPolicy: 'no-cache',
    onError: (error) => console.error('Polling error:', error),
  });

  const [board, setBoard] = useState(() => {
    const initialBoard = initializeBoard(game?.gameBoard);
    console.log('Initial board:', initialBoard);
    return initialBoard;
  });
  const [gameStatus, setGameStatus] = useState(game?.gameStatus || 'waiting');
  const [isYourTurn, setIsYourTurn] = useState(false);
  const [playerColor, setPlayerColor] = useState(null);
  const [updateGame] = useMutation(UPDATE_GAME);
  const [addGameResult] = useMutation(ADD_GAME_RESULT);

  useEffect(() => {
    const processGameData = async () => {
      if (!gameData?.game) {
        console.log('No game data available');
        return;
      }

      try {
        console.log('Raw game board from server:', gameData.game.gameBoard);
        let parsedBoard;
        
        try {
          parsedBoard = JSON.parse(gameData.game.gameBoard);
        } catch (e) {
          console.error('Error parsing game board:', e);
          parsedBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
        }
        
        console.log('Parsed board:', parsedBoard);
        
        const currentUserId = Auth.getProfile().data._id;
        const isHost = gameData.game.hostUser?._id === currentUserId;
        const isOpponent = gameData.game.opponentUser?._id === currentUserId;
        
        setBoard(parsedBoard);
        setGameStatus(gameData.game.gameStatus);
        setPlayerColor(isHost ? 'Red' : isOpponent ? 'Yellow' : null);
        
        const redCount = parsedBoard.flat().filter((cell) => cell === 'Red').length;
        const yellowCount = parsedBoard.flat().filter((cell) => cell === 'Yellow').length;
        const isRedTurn = redCount === yellowCount;
        
        console.log('Turn calculation:', {
          redCount,
          yellowCount,
          isRedTurn,
          currentPlayer: isHost ? 'Red' : 'Yellow',
          willSetTurnTo: (isHost && isRedTurn) || (isOpponent && !isRedTurn)
        });
        
        setIsYourTurn((isHost && isRedTurn) || (isOpponent && !isRedTurn));

        const winner = calculateWinner(parsedBoard);
        const isDraw = !winner && parsedBoard.flat().every((cell) => cell !== null);
        
        // Add game result if game is over
        if ((winner || isDraw) && gameData.game.gameStatus !== 'completed') {
          try {
            await addGameResult({
              variables: {
                gameType: 'connectfour',
                winningPlayer: winner ? (winner === 'Red' ? gameData.game.hostUser._id : gameData.game.opponentUser._id) : null,
                losingPlayer: winner ? (winner === 'Red' ? gameData.game.opponentUser._id : gameData.game.hostUser._id) : null,
                draw: isDraw,
                players: [
                  gameData.game.hostUser._id,
                  gameData.game.opponentUser._id
                ]
              }
            });
            
            // Only send required fields in the update
            await updateGame({
              variables: {
                _id: game._id,
                gameData: {
                  gameBoard: JSON.stringify(parsedBoard),
                  gameStatus: 'completed',
                  lobbyName: game.lobbyName,
                  gamesSelection: game.gamesSelection
                }
              }
            });
          } catch (error) {
            console.error('Error saving game result:', error);
          }
        }

      } catch (error) {
        console.error('Error processing game data:', error);
      }
    };

    processGameData();
  }, [gameData]);

  if (loading) return <div>Loading game...</div>;
  if (!game) return <div>No game data available</div>;

  const calculateWinner = (board) => {
    if (!board) return null;
    
    const directions = [
      { row: 0, col: 1 }, // Horizontal
      { row: 1, col: 0 }, // Vertical
      { row: 1, col: 1 }, // Diagonal down-right
      { row: 1, col: -1 }, // Diagonal down-left
    ];

    const checkDirection = (row, col, rowDir, colDir) => {
      if (!board[row]) return null;
      
      const color = board[row][col];
      if (!color) return null;

      for (let i = 1; i < 4; i++) {
        const newRow = row + i * rowDir;
        const newCol = col + i * colDir;
        if (
          newRow < 0 ||
          newRow >= ROWS ||
          newCol < 0 ||
          newCol >= COLS ||
          !board[newRow] ||
          board[newRow][newCol] !== color
        ) {
          return null;
        }
      }
      return color;
    };

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        for (const { row: rowDir, col: colDir } of directions) {
          const winner = checkDirection(row, col, rowDir, colDir);
          if (winner) return winner;
        }
      }
    }
    return null;
  };

  const handleClick = async (col) => {
    console.log('handleClick called for column:', col);
    
    if (calculateWinner(board) || !isYourTurn) {
      console.log('Move rejected - Winner:', calculateWinner(board), 'IsYourTurn:', isYourTurn);
      return;
    }

    const newBoard = board.map(row => [...row]);
    let moved = false;

    // Find the lowest empty spot in the column
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        console.log('Making move at row:', row, 'col:', col, 'color:', playerColor);
        newBoard[row][col] = playerColor;
        moved = true;
        break;
      }
    }

    if (!moved) {
      console.log('Column is full');
      return;
    }

    try {
      console.log('New board before sending:', newBoard);
      console.log('Stringified board:', JSON.stringify(newBoard));

      const response = await updateGame({
        variables: {
          _id: game._id,
          gameData: {
            gameBoard: JSON.stringify(newBoard),
            gameStatus: 'in_progress',
            lobbyName: game.lobbyName,
            gamesSelection: game.gamesSelection,
          },
        },
      });
      
      console.log('Server response:', response);
      
      setBoard(newBoard);
      setIsYourTurn(false);

    } catch (error) {
      console.error('Error updating game:', error);
    }
  };

  const resetGame = async () => {
    const emptyBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    try {
      await updateGame({
        variables: {
          _id: game._id,
          gameData: {
            gameBoard: JSON.stringify(emptyBoard),
            gameStatus: 'in_progress',
            lobbyName: game.lobbyName,
            gamesSelection: game.gamesSelection,
          },
        },
      });
      setBoard(emptyBoard);
      setGameStatus('in_progress');
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.flat().every((cell) => cell !== null);
  const isGameOver = winner || isDraw;
  const status = winner
    ? `${winner} wins!`
    : isDraw
    ? 'Draw!'
    : isYourTurn
    ? `Your turn: ${playerColor}`
    : 'Waiting for opponent...';

  console.log('Current board state:', board);
  console.log('Is your turn:', isYourTurn);
  console.log('Player color:', playerColor);

  if (!Array.isArray(board) || !board.every(row => Array.isArray(row))) {
    console.error('Invalid board structure:', board);
    return <div>Error: Invalid game board</div>;
  }

  return (
    <div className="game">
      <div className="status">{status}</div>
      <div className="board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div 
                key={j} 
                className={`cell ${cell || ''}`} 
                onClick={() => handleClick(j)}
              />
            ))}
          </div>
        ))}
      </div>
      {isGameOver && (
        <button className="reset" onClick={resetGame}>
          Play Again
        </button>
      )}
    </div>
  );
}

export { ConnectFour };
