const { Schema, default: mongoose } = require("mongoose");

const muteSchema = new Schema({
  MemberID: String,
  MutedAt: { type: Date, default: Date.now },
  MutedBy: String,
  MutedUntil: Date,
  Reason: String,
});

module.exports =
  mongoose.models["mutes"] || mongoose.model("mutes", muteSchema);
