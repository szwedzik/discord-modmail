const { Schema, default: mongoose } = require("mongoose");

const bansSchema = new Schema({
  MemberID: String,
  GuildID: String,
  BannedAt: { type: Date, default: Date.now },
  BannedBy: String,
  Reason: String,
});

module.exports = mongoose.models["bans"] || mongoose.model("bans", bansSchema);
