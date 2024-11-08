import { TicTacToe } from './Tictactoe/Tictactoe';
//import { RPS } from './RPS/RPS';
//import { Warships } from './Warships';
//import { ConnectFour } from './ConnectFour';
import { useQuery } from '@apollo/client';
import { QUERY_GAME } from '../../utils/queries';

export const Selection = ({ ID }) => {
  console.log('Selection Component ID:', ID);

  const { loading, error, data } = useQuery(QUERY_GAME, {
    variables: { id: ID },
    onError: (error) => {
      console.log('Query error:', error);
    }
  });

  console.log('Query Response:', { loading, error, data });

  console.log('About to render TicTacToe component');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const renderGame = () => {
    const gameSelection = data?.game?.gamesSelection;
    console.log('Game Selection:', gameSelection);
    
    switch (gameSelection?.toLowerCase()) {
      case 'tic-tac-toe':
        return <TicTacToe />;
      case 'warships':
        return <Warships />;
      case 'rps':
        return <RPS />;
      case 'connect-four':
        return <ConnectFour />;
        case 'RPS':
          return <RPS />;
      default:
        return <div>Please select a game (Selection: {gameSelection})</div>;
    }
  };

  return (
    <div>
      {renderGame()}
    </div>
  );
};
