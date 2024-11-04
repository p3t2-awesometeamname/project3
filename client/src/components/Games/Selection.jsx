import { TicTacToe } from './Tictactoe/Tictactoe';
//import { Warships } from './Warships';
//import { ConnectFour } from './ConnectFour';


const Selection = ({ gameSelection }) => {
  const renderGame = () => {
    switch (gameSelection) {
      case 'TicTacToe':
        return <TicTacToe />;
      case 'Warships':
        return <Warships />;
      case 'ConnectFour':
        return <ConnectFour />;
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
