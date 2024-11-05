const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameResultSchema = new Schema({
  gameType: {
    type: String,
    required: true,
  },
  winningPlayer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return !this.draw; }
  },
  losingPlayer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return !this.draw; }
  },
  draw: {
    type: Boolean,
    default: false,
  },
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  date: {
    type: Date,
    default: Date.now,
  }
});

const GameResult = mongoose.model('GameResult', gameResultSchema);

module.exports = GameResult;