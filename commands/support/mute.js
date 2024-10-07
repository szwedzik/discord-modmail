const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const { formattedDuration } = require("../../Utils/Duration");

const { sendLogs } = require("../../Utils/SendLogs");
const Modlogs = require("../../models/modlogs");
const Mutes = require("../../models/mutes");

const muteDuration = [
  { name: "1 minute", value: "60" },
  { name: "5 minutes", value: "300" },
  { name: "10 minutes", value: "600" },
  { name: "30 minutes", value: "1800" },
  { name: "1 hour", value: "3600" },
  { name: "2 hours", value: "7200" },
  { name: "6 hours", value: "21600" },
  { name: "12 hours", value: "43200" },
  { name: "1 day", value: "86400" },
  { name: "3 days", value: "259200" },
  { name: "7 days", value: "604800" },
  { name: "14 days", value: "1209600" },
  { name: "28 days", value: "2419100" },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to mute")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("The duration of the mute")
        .setRequired(true)
        .addChoices(muteDuration),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the mute")
        .setRequired(true),
    ),

  async execute(interaction) {
    const user = interaction.options.getMember("user");
    const duration = parseInt(interaction.options.getString("duration"));
    const reason = interaction.options.getString("reason");

    const Mute = await Mutes.findOne({
      MemberID: user.id,
      MutedUntil: { $gt: Date.now() },
    });

    const member = interaction.guild.members.cache.get(user.id);

    if (!member)
      return interaction.reply({ content: "User not found.", ephemeral: true });

    if (
      user.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        content: "You cannot mute this user.",
        ephemeral: true,
      });

    if (Mute)
      return interaction.reply({
        content: "User is already muted.",
        ephemeral: true,
      });

    user
      .timeout(duration * 1000, reason)
      .then(() => {
        interaction.reply({
          content: `**mod-action**: ${user} was muted for **${formattedDuration(duration)}** reason: **${reason}**`,
        });
      })
      .catch((error) => {
        interaction.reply({
          content: `Failed to mute ${user}. ${error}`,
          ephemeral: true,
        });
      });

    // fetch last 10 messages from the user from every channel save it in an array
    const lastMessages = [];
    const channels = interaction.guild.channels.cache.filter(
      (channel) => channel.type === 0,
    );
    for (const channel of channels.values()) {
      const messages = await channel.messages.fetch({ limit: 100 });
      const userMessages = messages
        .filter((message) => message.author.id === user.id)
        .map((message) => `<@${message.author.id}>: ${message.content}`);
      lastMessages.push(...userMessages);
    }

    const userLogEmbed = new EmbedBuilder()
      .setTitle("Muted")
      .setDescription(
        `You have been muted in **${interaction.guild.name}**\n\n**Last 10 messages:**\n ${lastMessages.length === 0 ? "No messages found" : `${lastMessages.splice(0, 10).join("\n")}`} \n\nIf you believe this is a mistake please contact the server moderators.`,
      )
      .addFields(
        { name: "Moderator", value: `${interaction.user}`, inline: true },
        {
          name: "Duration",
          value: `${formattedDuration(duration)}`,
          inline: true,
        },
        { name: "Reason", value: `${reason}`, inline: true },
      )
      .setTimestamp()
      .setFooter({
        text: "flexmarket.gg",
        iconURL:
          "https://cdn.discordapp.com/icons/1221231828594331758/d5ea833b0b888266fd17d400c7dd714a.webp?size=96",
      });

    const logEmbed = new EmbedBuilder()
      .setTitle("Mute")
      .setThumbnail("https://cdn-icons-png.freepik.com/512/1161/1161388.png")
      .setDescription(
        `User ${user} was muted\n\n**Last 10 messages**\n${lastMessages.length === 0 ? "No messages found" : `${lastMessages.splice(0, 10).join("\n")}`}`,
      )
      .addFields(
        {
          name: "Moderator",
          value: `${interaction.user} (${interaction.user.id})`,
          inline: true,
        },
        {
          name: "Duration",
          value: `${formattedDuration(duration)}`,
          inline: true,
        },
        { name: "Reason", value: `${reason}`, inline: true },
      )
      .setTimestamp()
      .setFooter({
        text: "Moderation Log ",
        iconURL: "https://cdn-icons-png.freepik.com/512/1161/1161388.png",
      });

    sendLogs(
      interaction,
      "Mute Logs",
      interaction.user.username,
      logEmbed,
      true,
    );

    try {
      new Mutes({
        MemberID: user.id,
        MutedBy: interaction.user.id,
        MutedUntil: Date.now() + duration * 1000,
        Reason: reason.toString(),
      }).save();
      new Modlogs({
        GuildID: interaction.guild.id,
        MemberID: user.id,
        Moderator: interaction.user.id,
        Reason: reason.toString(),
        Action: "Muteed".toString(),
      }).save();
      await user.send({ embeds: [userLogEmbed] });
    } catch (error) {
      console.error("Failed to send dm to user", error);
    }
  },
};
