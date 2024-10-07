const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { sendLogs } = require("../../Utils/SendLogs");
const Modlogs = require("../../Models/Modlogs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user.")
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("Provide the user ID to unban.")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for unbanning the user")
        .setRequired(true),
    ),

  async execute(interaction) {
    const user = interaction.options.getString("userid");
    const reason = interaction.options.getString("reason");

    try {
      await interaction.guild.members.unban(user, { reason: reason });
      interaction.reply({
        content: `User has been unbanned.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: "Could not find banned user.",
        ephemeral: true,
      });
      return;
    }

    const Log = new EmbedBuilder()
      .setTitle("Unban")
      .setColor(0x00ff00)
      .setThumbnail("https://cdn-icons-png.freepik.com/512/1161/1161388.png")
      .setDescription(`<@${user}> was **unbanned**`)
      .addFields(
        { name: "Moderator", value: `${interaction.user}`, inline: true },
        { name: "Reason", value: `${reason}`, inline: true },
      )
      .setFooter({
        text: `Moderation Log`,
        iconURL: "https://cdn-icons-png.freepik.com/512/1161/1161388.png",
      });

    sendLogs(interaction, "Unban Log", interaction.user.username, Log, true);
    new Modlogs({
      GuildID: interaction.guild.id,
      MemberID: user.id,
      Moderator: interaction.user.id,
      Reason: reason.toString(),
      Action: "Unbanned",
    }).save();
  },
};
