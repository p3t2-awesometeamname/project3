import { TicTacToe } from './Tictactoe/Tictactoe';
//import { Warships } from './Warships';
//import { ConnectFour } from './ConnectFour';
import {RPS} from './RPS/RPS';

const Selection = ({ gameSelection }) => {
  const renderGame = () => {
    switch (gameSelection) {
      case 'TicTacToe':
        return <TicTacToe />;
      case 'Warships':
        return <Warships />;
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


export default { Selection };
