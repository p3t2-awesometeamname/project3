import { TicTacToe } from './Tictactoe/Tictactoe';
import { RPS } from './RPS/RPS.jsx';
import { ConnectFour } from './ConnectFour/ConnectFour';
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const renderGame = () => {
    const gameSelection = data?.game?.gamesSelection;
    console.log('Game Selection:', gameSelection);
    
    switch (gameSelection?.toLowerCase()) {
      case 'tic-tac-toe':
        return <TicTacToe game={data.game} />;
      case 'connect-four':
        return <ConnectFour game={data.game} />;
      case 'rps':
        return <RPS game={data.game} />;
      default:
        return <div>No Game Selected</div>;
    }
  };

  return (
    <div>
      {renderGame()}
    </div>
  );
};
