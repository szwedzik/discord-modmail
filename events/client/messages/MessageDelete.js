const { EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
  name: "messageDelete",

  /**
   *
   * @param { Message } message
   */
  async execute(message) {
    if (message.author === null) return;
    if (message.author.bot) return;
    if (message.embeds.length > 0) return;
    if (message.channel.type === ChannelType.DM) return;

    const logCategory = message.guild.channels.cache.get("1238135434585047091");

    const log = new EmbedBuilder()
      .setTitle("Message Deleted")
      .setColor(0xff0000)
      .setDescription(
        `📕 A message by ${message.author} was **deleted** in ${message.channel}\n
            **Removed content**:\n${message.content}`.slice("0", "4096"),
      )
      .setFooter({
        text: `${message.author.username} (${message.author.id})`,
        iconURL: message.author.displayAvatarURL(),
      });

    if (message.attachments.size > 0) {
      log.addFields({
        name: "Attachments",
        value: message.attachments
          .map((attachment) => `🔗 [${attachment.name}](${attachment.url})`)
          .join(", "),
      });
    }

    if (
      logCategory.threads.cache.find((thread) => thread.name === "Message Log")
    ) {
      const logThread = logCategory.threads.cache.find(
        (thread) => thread.name === "Message Log",
      );
      logThread.send({ embeds: [log] });
    } else {
      logCategory.threads.create({
        name: "Message Log",
        type: "GUILD_PRIVATE_THREAD",
        message: {
          embeds: [log],
        },
      });
    }
  },
};
