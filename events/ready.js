const { loadCommands } = require("../Handlers/commandHandler");
const { loadButtons } = require("../Handlers/buttonHandler");
const mongoose = require("mongoose");
const { ActivityType } = require("discord.js");
const { loadModals } = require("../Handlers/modalHandler");
const { giveawayHandler } = require("../Handlers/giveawayHandler");

const green = "\x1b[32m";
const red = "\x1b[31m";
const reset = "\x1b[0m";

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Logged in as: ${green}${client.user.tag}${reset}`);
    client.user.setPresence({
      activities: [{ name: "DM for Mod help!", type: ActivityType.Playing }],
    });

    if (!client.config.db) return;
    mongoose
      .connect(client.config.db)
      .then(() => {
        console.log(
          `${green}Database connection has been established.${reset}`,
        );
      })
      .catch((err) => {
        console.log(`Database Error: ${red}` + err + `${reset}`);
      });
    loadCommands(client);
    loadButtons(client);
    loadModals(client);
    giveawayHandler(client);
  },
};
