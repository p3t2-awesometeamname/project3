
import CreateGame from "../components/CreateGame/createGame";
import GameList from "../components/GameList/gamelist"

const Lobby = () => {
  return (
    <div>
      <div>
        <h2>CREATE GAME FORM SHOULD APPEAR HERE</h2>
      {/* <CreateGame /> */}
      </div>
      <div>
        <h2>GAME LIST SHOULD APPEAR HERE</h2>
      <GameList />
      </div>
    </div>
  );
};

export default Lobby;
