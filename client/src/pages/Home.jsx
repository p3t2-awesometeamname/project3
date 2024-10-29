import { useGlobalContext } from "../utils/GlobalState";
import { QUERY_USERS } from "../utils/queries";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { SET_USERS } from "../utils/actions";

const Home = () => {

    
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
    <div className="container">
     <h1>HOME PROJECT 3 Made a Change changes</h1>
     {state.users.map(user => (<div key={user.email}>{user.email}</div>))}
    </div>
  );
};

export default Home;
