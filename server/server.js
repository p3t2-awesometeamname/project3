const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const { Server } = require('socket.io');

const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./schemas/resolvers');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create Socket.IO instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update this to match your Vite dev server port
    methods: ["GET", "POST"]
  }
});

// Game state management
const games = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('joinGame', () => {
    let gameId;
    let availableGame = [...games.entries()].find(([_, game]) => game.players.length === 1);

    if (availableGame) {
      // Join existing game
      gameId = availableGame[0];
      games.get(gameId).players.push(socket.id);
      socket.join(gameId);
      socket.emit('gameJoined', { gameId, symbol: 'O' });
      io.to(gameId).emit('gameStart');
    } else {
      // Create new game
      gameId = Math.random().toString(36).substring(7);
      games.set(gameId, {
        players: [socket.id],
        board: Array(9).fill(null),
        nextTurn: true
      });
      socket.join(gameId);
      socket.emit('gameJoined', { gameId, symbol: 'X' });
    }
  });

  socket.on('makeMove', ({ gameId, board, position }) => {
    const game = games.get(gameId);
    if (game) {
      game.board = board;
      game.nextTurn = !game.nextTurn;
      io.to(gameId).emit('moveMade', {
        board: game.board,
        nextTurn: game.nextTurn
      });
    }
  });

  socket.on('disconnect', () => {
    for (const [gameId, game] of games.entries()) {
      if (game.players.includes(socket.id)) {
        io.to(gameId).emit('playerDisconnected');
        games.delete(gameId);
      }
    }
  });
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Serve up static assets
  app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer();
