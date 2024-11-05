import React, { useState } from "react";

const BOARD_SIZE = 10;
const SHIP_LENGTH = 3;

const generateBoard = () => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
}

const placeShip = (board) => {
  const newBoard = [...board];
  const row = Math.floor(Math.random() * BOARD_SIZE);
  const col = Math.floor(Math.random() * (BOARD_SIZE - SHIP_LENGTH));
  for (let i = 0; i < SHIP_LENGTH; i++) {
    newBoard[row][col + i] = 'S';
  }
  return newBoard;
};

const Battleship = () => {
  const [board, setBoard] = useState(placeShip(generateBoard()));
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);

  const handleCellClick = (row, col) => {
    if (board[row][col] === 'S') {
      setHits(hits + 1);
      board[row][col] = 'H';
    } else {
      setMisses(misses + 1);
      board[row][col] = 'M';
    }
    setBoard([...board]);
  };

return (
  <div>
    <h1>Battleship</h1>
    <div>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              style={{
                width: 30,
                height: 30,
                border: '1px solid black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: cell === 'H' ? 'red' : cell === 'M' ? 'gray' : 'white',
              }}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
    <div>
      <p>Hits: {hits}</p>
      <p>Misses: {misses}</p>
    </div>
  </div>
);
};

// just a board with a ship on it
export default Battleship;