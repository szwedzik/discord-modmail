const config = require("../config.json");

/**
 * @param {Object} Guild The interaction object
 * @param {String} threadName The name of the thread
 * @param {String} moderator The name of the moderator
 * @param {Object} embed The embed object
 * @param {Boolean} modlogs If the logs are for moderation logs
 */

function sendLogs(Guild, threadName, moderator, embed, modlogs = false) {
  const logs = Guild.guild.channels.cache.get(
    config.channel_categories.discord_logs.log,
  );
  const modlog = Guild.guild.channels.cache.get(
    config.channel_categories.discord_logs.mod,
  );
  const personal = Guild.guild.channels.cache.get(
    config.channel_categories.discord_logs.personal,
  );

  if (
    modlogs
      ? modlog.threads.cache.find((thread) => thread.name === `${threadName}`)
      : logs.threads.cache.find((thread) => thread.name === `${threadName}`)
  ) {
    const logThread = modlogs
      ? modlog.threads.cache.find((thread) => thread.name === `${threadName}`)
      : logs.threads.cache.find((thread) => thread.name === `${threadName}`);
    logThread.send({ embeds: [embed] });
  } else {
    logs.threads.create({
      name: `${threadName}`,
      type: "GUILD_PRIVATE_THREAD",
      message: {
        embeds: [embed],
      },
    });
  }

  if (personal.threads.cache.find((thread) => thread.name === `${moderator}`)) {
    const logThread = personal.threads.cache.find(
      (thread) => thread.name === `${moderator}`,
    );
    logThread.send({ embeds: [embed] });
  } else {
    personal.threads.create({
      name: `${moderator}`,
      type: "GUILD_PRIVATE_THREAD",
      message: {
        embeds: [embed],
      },
    });
  }
}

exports.sendLogs = sendLogs;
