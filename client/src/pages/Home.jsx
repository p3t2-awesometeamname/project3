import { useGlobalContext } from "../utils/GlobalState";
import { QUERY_USERS } from "../utils/queries";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { SET_USERS } from "../utils/actions";
import CreateGame from "../components/CreateGame/createGame";
import GameList from "../components/GameList/gamelist"

// import useWebSocket from 'react-use-websocket';

const Home = () => {

    // const WS_URL = 'ws://localhost:3001'
    // useWebSocket(WS_URL,{
    //   queryParams: {users}
    // })
    const [state, dispatch] = useGlobalContext();
    const {data, loading} = useQuery(QUERY_USERS);
    
    
    const users = data?.users || []
    console.log(users)

    useEffect(() => {
        dispatch({type: SET_USERS, payload: users})
    }, [data])

    if (loading) {
        return <h3>Loading...</h3>
    }
  return (
    <div>
      <div className="container">
          <CreateGame />
      </div>
      <div>
        <GameList />
      </div>
    </div>
  );
};

export default Home;
