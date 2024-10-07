const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const Mutes = require("../../models/mutes");
const Modlogs = require("../../models/modlogs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whois")
    .setDescription("Get information about a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user or user ID to get info about")
        .setRequired(true),
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;

    const Mute = await Mutes.findOne({
      MemberID: user.id,
      MutedUntil: { $gte: Date.now() },
    });
    const modlogs = await Modlogs.find({ MemberID: user.id }).limit(10);

    const member = interaction.guild.members.cache.get(user.id);
    if (!member)
      return interaction.reply({ content: "User not found.", ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle(`Information about: ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "Username", value: user.username, inline: true },
        { name: "Displayname", value: user.displayName, inline: true },
        {
          name: "Account Created",
          value: `<t:${parseInt(user.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Joined Server",
          value: `<t:${parseInt(interaction.guild.members.cache.get(user.id).joinedTimestamp / 1000)}:R>`,
          inline: true,
        },
        { name: "Bot Account", value: user.bot ? "Yes" : "No", inline: true },
        {
          name: "Roles",
          value: `${interaction.guild.members.cache
            .get(user.id)
            .roles.cache.map((role) => `<@&${role.id}>`)
            .join("\n")}`,
          inline: true,
        },
      )
      .setTimestamp()
      .setFooter({ text: `${user.username}: ${user.id}` });

    if (Mute) {
      embed.addFields(
        {
          name: "Mute expiries",
          value: `<t:${parseInt(Mute.MutedUntil / 1000)}:R>`,
          inline: true,
        },
        { name: "Muted by", value: `<@${Mute.MutedBy}>`, inline: true },
        { name: "Reason", value: Mute.Reason.toString(), inline: true },
      );
    }
    if (modlogs) {
      embed.addFields(
        {
          name: `Mod logs`,
          value: modlogs
            .map(
              (log) =>
                `> **${log.Action}** by <@${log.Moderator}> reason: ${log.Reason}`,
            )
            .join("\n"),
          inline: true,
        },
        {
          name: "Timesamp",
          value: modlogs
            .map((log) => `<t:${parseInt(log.Date / 1000)}:R>`)
            .join("\n"),
          inline: true,
        },
      );
    }
    interaction.reply({ embeds: [embed] });
  },
};
