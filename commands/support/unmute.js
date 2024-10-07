const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Mute = require("../../Models/Mutes");
const { sendLogs } = require("../../Utils/SendLogs");
const Modlogs = require("../../Models/Modlogs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to unmute")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for unmuting this user")
        .setRequired(true),
    ),

  async execute(interaction) {
    const member = interaction.options.getMember("user") || interaction.member;
    const reason = interaction.options.getString("reason");

    const inServer = interaction.guild.members.cache.get(member.id);

    if (!inServer)
      return interaction.reply({ content: "User not found.", ephemeral: true });

    if (member.id === interaction.user.id)
      return interaction.reply({
        content: "You cannot unmute yourself.",
        ephemeral: true,
      });

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        content: "You cannot unmute this user.",
        ephemeral: true,
      });

    const muteData = await Mute.findOne({ MemberID: member.id });
    if (!muteData)
      return interaction.reply({
        content: "This user is not muted.",
        ephemeral: true,
      });

    await muteData.deleteOne();

    member
      .timeout(null, `${reason}`)
      .then(() => {
        interaction.reply({
          content: `${member} has been unmuted.`,
          ephemeral: true,
        });
      })
      .catch(() => {
        interaction.reply({
          content: "An error occurred while unmuting this user.",
          ephemeral: true,
        });
      });

    const Log = new EmbedBuilder()
      .setTitle("Unmute")
      .setColor(0x00ff00)
      .setThumbnail("https://cdn-icons-png.freepik.com/512/1161/1161388.png")
      .setDescription(`${member} was **unmuted**`)
      .addFields(
        { name: "Moderator", value: `${interaction.user}`, inline: true },
        { name: "Reason", value: `${reason.toString()}`, inline: true },
      )
      .setFooter({
        text: `Moderation Log`,
        iconURL: "https://cdn-icons-png.freepik.com/512/1161/1161388.png",
      });
    const UserEmbed = new EmbedBuilder()
      .setTitle("Unmute")
      .setDescription(`You have been **unmuted** in ${interaction.guild.name}`)
      .addFields(
        { name: "Moderator", value: `${interaction.user}`, inline: true },
        { name: "Reason", value: `${reason.toString()}`, inline: true },
      )
      .setTimestamp()
      .setFooter({
        text: "flexmarket.gg",
        iconURL:
          "https://cdn.discordapp.com/icons/1221231828594331758/d5ea833b0b888266fd17d400c7dd714a.webp?size=96",
      });

    sendLogs(interaction, "Unmute Log", interaction.user.username, Log, true);

    try {
      await member.send({ embeds: [UserEmbed] });
      new Modlogs({
        GuildID: interaction.guild.id,
        MemberID: member.user.id,
        Moderator: interaction.user.id,
        Reason: reason.toString(),
        Action: "Unmuted",
      }).save();
    } catch (error) {
      console.log(error);
    }
  },
};
