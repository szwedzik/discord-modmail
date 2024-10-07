const { Schema, default: mongoose } = require("mongoose");

const userLevelsSchema = new Schema({
  GuildId: String,
  UserId: String,
  Xp: Number,
  Level: { type: Number, default: 0 },
});

module.exports =
  mongoose.models["userLevels"] ||
  mongoose.model("userLevels", userLevelsSchema);
