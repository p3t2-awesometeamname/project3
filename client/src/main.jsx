import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from './App.jsx';
import Home from './pages/Home';
import NoMatch from './pages/NoMatch';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About.jsx';
import GameRoom from './pages/GameRoom.jsx';
import GameDetail from './pages/GameDetail.jsx'; // Import the new GameDetail component
import Profile from './pages/Profile.jsx'; // Import the new Profile component

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NoMatch />,
    children: [
      {
        index: true,
        element: <Home />
      }, {
        path: '/login',
        element: <Login />
      }, {
        path: '/signup',
        element: <Signup />
      }, {
        path: '/about',
        element: <About />
      },
      {
        path: '/GameRoom',
        element: <GameRoom />
      },
      {
        path: '/GameDetail/:id', 
        element: <GameDetail />
      },
      {
        path: '/Profile/', 
        element: <Profile />
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
