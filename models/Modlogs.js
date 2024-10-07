const { Schema, default: mongoose } = require("mongoose");

const modlogsSchema = new Schema({
  GuildID: String,
  MemberID: String,
  Moderator: String,
  Reason: String,
  Action: String,
  Date: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models["modlogs"] || mongoose.model("modlogs", modlogsSchema);
