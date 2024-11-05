const mongoose = require('mongoose');

const { Schema } = mongoose;

const gameSchema = new Schema({
  lobbyName: {
    type: String,
    required: true,
    minlength: 3
  },
  hostUser: {
      type: Schema.Types.ObjectId,
      required: true,
        ref: 'User'
    },
    opponentUser: {
      type: Schema.Types.ObjectId,
      required: false,
      default: null,
      ref: 'User'
    },
     gamesSelection: {
      type: String,
      required: true,
      
    }    
  });

  const Game = mongoose.model('Game', gameSchema);

  module.exports = Game;