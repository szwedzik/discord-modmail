const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} = require("discord.js");
const ms = require("ms");
const giveaway = require("../../../models/giveaway");

module.exports = {
  subCommand: "giveaway.create",

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */
  execute(interaction, client) {
    const channel = interaction.options.getChannel("channel");
    const description = interaction.options.getString("description");
    const prize = interaction.options.getString("prize");
    const winners = interaction.options.getInteger("winners");
    const duration = interaction.options.getString("duration");

    if (channel.type != ChannelType.GuildText)
      return interaction.reply({
        content: "Provided channel is not a text channel.",
        ephemeral: true,
      });
    if (winners < 1)
      return interaction.reply({
        content: "There must be atleast one winner",
        ephemeral: true,
      });
    const end = Date.now() + ms(duration);

    const embed = new EmbedBuilder()
      .setTitle("🎉 New Giveaway!")
      .setDescription(description)
      .addFields(
        { name: "Prize", value: prize, inline: true },
        {
          name: "Giveaway ends",
          value: `<t:${parseInt(end / 1000)}:R>`,
          inline: true,
        },
      )
      .setTimestamp()
      .setColor(parseInt(client.config.color.replace("#", ""), 16));

    const btn = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("giveaway-join")
        .setLabel("🎉 Participate")
        .setStyle(ButtonStyle.Primary),
    );

    try {
      channel
        .send({
          content: `<@&1239353280975339632> `,
          embeds: [embed],
          components: [btn],
        })
        .then((msg) => {
          new giveaway({
            GuildID: interaction.guild.id,
            Winners: winners,
            Participants: [],
            Prize: prize,
            Description: description,
            CreatedBy: interaction.user.id,
            CreatedAt: Date.now(),
            Ends: end,
            Active: true,
            MessageID: msg.id,
            ChannelID: channel.id,
          }).save();
        });
      interaction.reply({
        content: "Giveaway created successfully!",
        ephemeral: true,
      });
    } catch (error) {
      interaction.reply({
        content: "An error occurred while creating the giveaway",
        ephemeral: true,
      });
      console.error(error);
    }
  },
};
