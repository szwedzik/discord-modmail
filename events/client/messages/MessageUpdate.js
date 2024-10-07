const { EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
  name: "messageUpdate",

  /**
   *
   * @param { Message } oldMessage
   * @param { Message } newMessage
   */
  async execute(oldMessage, newMessage) {
    if (newMessage.author === null) return;
    if (newMessage.author.bot) return;
    if (newMessage.embeds.length > 0) return;
    if (newMessage.channel.type === ChannelType.DM) return;

    if (oldMessage.content === newMessage.content) return;

    const logCategory = oldMessage.guild.channels.cache.get(
      "1238135434585047091",
    );

    const count = 1950;

    const Original =
      oldMessage.content.slice(0, count) +
      (oldMessage.content.length > count ? "..." : "");
    const Updated =
      newMessage.content.slice(0, count) +
      (newMessage.content.length > count ? "..." : "");

    const Log = new EmbedBuilder()
      .setTitle("Message Edited")
      .setDescription(
        `📘 A [message](${newMessage.url}) by ${newMessage.author} was **edited** in ${newMessage.channel}\n
            **Original**:\n${Original}\n
            **Updated**:\n${Updated}`.slice("0", "4096"),
      )
      .setFooter({
        text: `${newMessage.author.username} (${newMessage.author.id})`,
        iconURL: newMessage.author.displayAvatarURL(),
      });

    if (newMessage.attachments.size > 0) {
      Log.addFields({
        name: "Attachments",
        value: newMessage.attachments
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
      logThread.send({ embeds: [Log] });
    } else {
      logCategory.threads.create({
        name: "Message Log",
        type: "GUILD_PRIVATE_THREAD",
        message: {
          embeds: [Log],
        },
      });
    }
  },
};
