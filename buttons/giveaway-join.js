const {
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const giveaway = require("../models/giveaway");
module.exports = {
  id: "giveaway-join",
  developer: false,
  permission: PermissionFlagsBits.everyone,

  async execute(interaction) {
    const data = await giveaway.findOne({
      MessageID: interaction.message.id,
      Active: true,
    });

    if (!data)
      return interaction.reply({
        content: "This giveaway does not exist",
        ephemeral: true,
      });
    if (data.Participants.includes(interaction.user.id))
      return interaction.reply({
        content: "You have already joined the giveaway!",
        ephemeral: true,
      });

    data.Participants.push(interaction.user.id);

    await data.save();

    interaction.reply({
      content: "🎉 You have successfully joind the giveaway!",
      ephemeral: true,
    });

    const participants = data.Participants.length;
    const btn = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("giveaway-join")
        .setLabel(`🎉 Participate (${participants.toLocaleString()})`)
        .setStyle(ButtonStyle.Primary),
    );

    await interaction.message.edit({ components: [btn] });
  },
};
