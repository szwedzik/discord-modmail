const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { sendLogs } = require("../../Utils/SendLogs");

const slowmodeDurations = [
  { name: "Off", value: "0" },
  { name: "5 seconds", value: "5" },
  { name: "10 seconds", value: "10" },
  { name: "15 seconds", value: "15" },
  { name: "30 seconds", value: "30" },
  { name: "1 minute", value: "60" },
  { name: "2 minutes", value: "120" },
  { name: "5 minutes", value: "300" },
  { name: "10 minutes", value: "600" },
  { name: "15 minutes", value: "900" },
  { name: "30 minutes", value: "1800" },
  { name: "1 hour", value: "3600" },
  { name: "2 hours", value: "7200" },
  { name: "6 hours", value: "21600" },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Set the slowmode of a channel")
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("The duration of slowmode")
        .setRequired(true)
        .addChoices(slowmodeDurations),
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to set slowmode in")
        .setRequired(true),
    ),

  async execute(interaction, client) {
    const duration = parseInt(interaction.options.getString("duration"));
    const channel = interaction.options.getChannel("channel");

    if (channel.type !== 0)
      return interaction.reply({
        content: "Slowmode can only be set on text channels.",
        ephemeral: true,
      });

    const formattedDuration =
      duration < 60
        ? `${duration} seconds`
        : duration < 3600
          ? `${duration / 60} minutes`
          : `${duration / 3600} hours`;

    // TODO: Log slowmode change
    const logEmbed = new EmbedBuilder()
      .setTitle("Slowmode")
      .setThumbnail("https://cdn-icons-png.freepik.com/512/1161/1161388.png")
      .setDescription(
        `${formattedDuration === 0 ? `Slowmode turned off in ${channel}` : `Slowmode set to ${formattedDuration} in ${channel}`}`,
      )
      .addFields(
        {
          name: "Moderator",
          value: `${interaction.user} (${interaction.user.id})`,
          inline: true,
        },
        { name: "Duration", value: `${formattedDuration}`, inline: true },
        { name: "Channel", value: `${channel}`, inline: true },
      )
      .setTimestamp()
      .setFooter({
        text: "Moderation Log ",
        iconURL: "https://cdn-icons-png.freepik.com/512/1161/1161388.png",
      });

    sendLogs(
      interaction,
      "Slowmode Logs",
      interaction.user.username,
      logEmbed,
      true,
    );

    if (duration === 0) {
      channel.setRateLimitPerUser(0);
      return interaction.reply({
        content: `**mod-action**: The slowmode of ${channel} was turned **off**.`,
      });
    }

    channel.setRateLimitPerUser(duration);

    interaction.reply({
      content: `**mod-action**: The slowmode of ${channel} was set to **${formattedDuration}**.`,
    });
  },
};
