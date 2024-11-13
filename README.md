# Playwise



## Multiplayer Game App

Welcome to the Playwise! This application allows users to create and join multiplayer game lobbies to play various games such as Tic-Tac-Toe, Connect Four, and Rock Paper Scissors. The app uses polling to keep the game state updated in real-time, ensuring a smooth multiplayer experience.

Table of Contents

## Features
- Multiplayer Lobbies: Create and join game lobbies to play with friends or other users.
- Real-time Updates: The app uses polling to keep the game state updated in real-time.
- Multiple Games: Play different games including Tic-Tac-Toe, Connect Four, and Rock Paper Scissors.
- User Authentication: Secure user authentication using JWT.
- Game History: View your game history and results.

## Technologies Used

- Frontend: React, Apollo Client, React Router
- Backend: Node.js, Express, Apollo Server, MongoDB
- Real-time Updates: Polling with Apollo Client
- Authentication: JWT (JSON Web Token)
- Styling: CSS

## Setup and Installation
1. Install dependencies
```
npm install
```
2. Start the development server
```
npm run develop
```
3. Seed the database
```
npm run seed
```


## Usage

- Sign Up: Create a new account or log in with an existing account.
- Create a Game Lobby: Navigate to the "Create Game" section and choose a game to create a new lobby.
- Join a Game Lobby: Browse the available game lobbies and join one to start playing.
- Play the Game: Make your moves and enjoy the game. The game state will be updated in real-time using polling.
- View Game History: Check your game history and results in the "Profile" section.

## Deployment

https://project3-027o.onrender.com/

## License

This project is licensed under the MIT License.