import { TicTacToe } from './Tictactoe/Tictactoe';
//import { RPS } from './RPS/RPS';
//import { Warships } from './Warships';
//import { ConnectFour } from './ConnectFour';
import { useEffect } from 'react';


const Selection = ({ gameSelection }) => {
  useEffect(() => {
    renderGame();
  }, [gameSelection]);

  const renderGame = () => {
    switch (gameSelection) {
      case 'TicTacToe':
        return <TicTacToe />;
      case 'Warships':
        return <Warships />;
      case 'RPS':
        return <RPS />;
      case 'ConnectFour':
        return <ConnectFour />;
        case 'RPS':
          return <RPS />;
      default:
        return <div>Please select a game</div>;
    }
  };

  return (
    <div>
      {renderGame()}
    </div>
  );
};


export default Selection;
