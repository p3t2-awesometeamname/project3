const mongoose = require('mongoose');

const { Schema } = mongoose;
// const bcrypt = require('bcrypt');

const gameInstanceSchema = new Schema({
  gameId: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: Number,
    required: true,
    trim: true
  },
  gameType: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false,
    minlength: 3
  }
});

// set up pre-save middleware to create password
// gameInstanceSchema.pre('save', async function(next) {
//   if (this.isNew || this.isModified('password')) {
//     const saltRounds = 10;
//     this.password = await bcrypt.hash(this.password, saltRounds);
//   }

//   next();
// });

// compare the incoming password with the hashed password
// gameInstanceSchema.methods.isCorrectPassword = async function(password) {
//   return await bcrypt.compare(password, this.password);
// };

const GameInstance = mongoose.model('GameInstance', gameInstanceSchema);

module.exports = GameInstance;
