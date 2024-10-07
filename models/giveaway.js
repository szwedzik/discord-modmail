const { Schema, default: mongoose } = require("mongoose");

const giveawaySchema = new Schema({
  GuildID: String,
  Winners: Number,
  Participants: Array,
  Prize: String,
  Description: String,
  CreatedBy: String,
  CreatedAt: Date,
  Ends: Date,
  Active: Boolean,
  MessageID: String,
  ChannelID: String,
});

module.exports =
  mongoose.models["giveaway"] || mongoose.model("giveaway", giveawaySchema);
