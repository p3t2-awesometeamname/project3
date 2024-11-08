import { useGlobalContext } from "../utils/GlobalState";
import { QUERY_USERS } from "../utils/queries";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { SET_USERS } from "../utils/actions";
import CreateGame from "../components/CreateGame/createGame";
import GameList from "../components/GameList/gamelist";
import GameHistory from "../components/GameHistory/GameHistory";
import './Home.css';

const Home = () => {
  const [state, dispatch] = useGlobalContext();
  const { data, loading } = useQuery(QUERY_USERS);

  const users = data?.users || [];
  console.log(users);

  useEffect(() => {
    dispatch({ type: SET_USERS, payload: users });
  }, [data]);

  if (loading) {
    return <h3>Loading...</h3>;
  }
  return (
    <div className="home-container">
      <div className="side-by-side">
        <div className="create-game-section">
          <h2>Create Game</h2>
          <CreateGame />
        </div>
        <div className="game-list-section">
          <h2>Available Games</h2>
          <div className="scrollable-card">
            <GameList />
          </div>
        </div>
      </div>
      <div className="game-history-section">
        <h2>Game History</h2>
        <GameHistory />
      </div>
    </div>
  );
};

export default Home;