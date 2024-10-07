const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberRemove",

  async execute(interaction) {
    const logChannel = interaction.guild.channels.cache.get(
      "1238135434585047091",
    );

    const leaveEmbed = new EmbedBuilder()
      .setTitle("Member left.")
      .setDescription(`${interaction.user} (${interaction.user.id})`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setColor(0xff0000)
      .setTimestamp();

    if (
      logChannel.threads.cache.find(
        (thread) => thread.name === "Members Left Log",
      )
    ) {
      const logThread = logChannel.threads.cache.find(
        (thread) => thread.name === "Members Left Log",
      );
      logThread.send({ embeds: [leaveEmbed] });
    } else {
      logChannel.threads.create({
        name: "Members Left Log",
        type: "GUILD_PRIVATE_THREAD",
        message: {
          embeds: [leaveEmbed],
        },
      });
    }
  },
};
