const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Bans = require("../../models/bans");
const { sendLogs } = require("../../Utils/SendLogs");
const Modlogs = require("../../Models/Modlogs");
const strings  = require("../../utils/strings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to ban or user ID")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for banning the user")
        .setRequired(true),
    ),

  async execute(interaction, client) {
    const user = interaction.options.getMember("user") || interaction.user;
    const reason = interaction.options.getString("reason");

    const member = interaction.guild.members.cache.get(user.id);

    if (!member)
      return interaction.reply({
        content: `${strings.modaction.messages.ban.notfound}`,
        ephemeral: true,
      });

    if (user.id === interaction.user.id)
      return interaction.reply({
        content: `${strings.modaction.messages.ban.self}`,
        ephemeral: true,
      });

    if (user.id === interaction.guild.ownerId)
      return interaction.reply({
        content: `${strings.modaction.messages.ban.owner}`,
        ephemeral: true,
      });

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        content: `${strings.modaction.messages.ban.higher}`,
        ephemeral: true,
      });

    const UserEmbed = new EmbedBuilder()
      .setTitle(`${strings.modaction.modals.ban.user.title}`)
      .setColor(parseInt(client.config.color.replace("#", ""), 16))
      .setDescription(
        `${strings.modaction.modals.ban.user.description.replace("{server}", interaction.guild.name)}`,
      )
      .addFields(
        {
          name: `${strings.modaction.modals.ban.log.moderator}`,
          value: `${interaction.user}`,
          inline: true,
        },
        {
          name: `${strings.modaction.modals.ban.log.reason}`,
          value: `${reason}`,
          inline: true,
        },
      )
      .setFooter({
        text: "flexmarket.gg",
        iconURL:
          "https://cdn.discordapp.com/icons/1221231828594331758/d5ea833b0b888266fd17d400c7dd714a.webp?size=96",
      });

    const Log = new EmbedBuilder()
      .setTitle("Ban")
      .setColor(parseInt(client.config.color.replace("#", ""), 16))
      .setThumbnail("https://cdn-icons-png.freepik.com/512/1161/1161388.png")
      .setDescription(
        `${strings.modaction.modals.ban.log.description.replace("{user}", user.user)}`,
      )
      .addFields(
        {
          name: `${strings.modaction.modals.ban.log.moderator}`,
          value: `${interaction.user}`,
          inline: true,
        },
        {
          name: `${strings.modaction.modals.ban.log.reason}`,
          value: `${reason}`,
          inline: true,
        },
      )
      .setFooter({
        text: "Moderation Log ",
        iconURL: "https://cdn-icons-png.freepik.com/512/1161/1161388.png",
      });

    try {
      await user.send({ embeds: [UserEmbed] });
      await user
        .ban({ days: 7, reason: reason })
        .then(() => {
          interaction.reply({
            content: `${strings.modaction.messages.ban.modaction.replace("{user}", user).replace("{moderator}", interaction.user).replace("{reason}", reason)
            }`,
          });
        })
        .catch(() => {
          interaction.reply({
            content: "An error occurred while banning this user.",
            ephemeral: true,
          });
        });
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: "An error occurred while banning this user.",
        ephemeral: true,
      });
    }

    sendLogs(interaction, "Ban Logs", interaction.user.username, Log, true);

    new Bans({
      MemberID: user.id,
      GuildId: interaction.guild.id,
      Reason: reason.toString(),
      BannedBy: interaction.user.id,
    }).save();
    new Modlogs({
      GuildID: interaction.guild.id,
      MemberID: user.id,
      Moderator: interaction.user.id,
      Reason: reason.toString(),
      Action: "Banned",
    }).save();
  },
};
