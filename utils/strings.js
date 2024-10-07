module.exports = {
  modaction: {
    modals: {
      ban: {
        log: {
          title: "Ban",
          description: "{user} has been **banned**",
          moderator: "Moderator",
          reason: "Reason",
        },
        user: {
          title: "Banned",
          description: "You have been banned from **{server}**",
        },
      },
    },
    messages: {
      ban: {
        notfound: "User not found.",
        self: "You cannot ban yourself.",
        owner: "You cannot ban the server owner.",
        higher: "You cannot ban this user.",
        modaction: "🔨 {user} has been banned by {moderator} for **{reason}**",
      },
    },
  },
  giveaway: {
    messages: {
      giveawayEnded: "🎉 Giveaway Ended! [RESULTS]",
      winners:
        "The winners of this giveaway are tagged above! Congratulations! 🎉",
      participants: "Participants: {participants}",
      prize: "Prize",
      participate_btn: "🎉 Participate ({participants})",
    },
  },
};
