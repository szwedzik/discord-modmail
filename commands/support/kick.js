const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const { sendLogs } = require("../../Utils/SendLogs");
const Modlogs = require("../../Models/Modlogs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to kick")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the kick")
        .setRequired(true),
    ),

  async execute(interaction) {
    const user = interaction.options.getMember("user") || interaction.user;
    const reason = interaction.options.getString("reason");

    const member = interaction.guild.members.cache.get(user.id);

    if (!member)
      return interaction.reply({ content: "User not found.", ephemeral: true });

    if (user.id === interaction.user.id)
      return interaction.reply({
        content: "You cannot kick yourself.",
        ephemeral: true,
      });

    if (user.id === interaction.guild.ownerId)
      return interaction.reply({
        content: "You cannot kick the server owner.",
        ephemeral: true,
      });

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        content: "You cannot kick this user.",
        ephemeral: true,
      });

    const UserEmbed = new EmbedBuilder()
      .setTitle("You have been kicked")
      .setDescription(`You have been kicked from **${interaction.guild.name}**`)
      .addFields(
        { name: "Moderator", value: `${interaction.user}`, inline: true },
        { name: "Reason", value: `${reason}`, inline: true },
      )
      .setFooter({
        text: "flexmarket.gg",
        iconURL:
          "https://cdn.discordapp.com/icons/1221231828594331758/d5ea833b0b888266fd17d400c7dd714a.webp?size=96",
      });

    const Log = new EmbedBuilder()
      .setTitle("Kick")
      .setThumbnail("https://cdn-icons-png.freepik.com/512/1161/1161388.png")
      .setDescription(`${user} was **kicked**`)
      .addFields(
        { name: "Moderator", value: `${interaction.user}`, inline: true },
        { name: "Reason", value: `${reason}`, inline: true },
      )
      .setTimestamp()
      .setFooter({
        text: "Moderation Log ",
        iconURL: "https://cdn-icons-png.freepik.com/512/1161/1161388.png",
      });

    try {
      await member.send({ embeds: [UserEmbed] });
    } catch (error) {
      console.error(`Failed to send message to ${member.user.tag} \n`, error);
    }

    member
      .kick({ reason: reason })
      .then(() => {
        interaction.reply({
          content: `**mod-action**: ${user} was kicked reason: **${reason}**`,
        });
      })
      .catch(() => {
        interaction.reply({
          content: "An error occurred while kicking the user.",
          ephemeral: true,
        });
      });

    sendLogs(interaction, "Kick Logs", interaction.user.username, Log, true);
    new Modlogs({
      GuildID: interaction.guild.id,
      MemberID: user.id,
      Moderator: interaction.user.id,
      Reason: reason.toString(),
      Action: "Kicked",
    }).save();
  },
};
