const { Schema, default: mongoose } = require("mongoose");

const ticketsSchema = new Schema({
  Id: Number,
  MemberName: String,
  MemberID: String,
  ChannelID: String,
  Closed: { type: Boolean, default: false },
  CreatedAt: { type: Date, default: Date.now },
  ClosedAt: { type: Date, default: null },
  CloseReason: { type: String, default: null },
  ClosedBy: { type: String, default: null },
});

module.exports =
  mongoose.models["tickets"] || mongoose.model("tickets", ticketsSchema);
