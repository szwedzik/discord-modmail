const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const giveaway = require("../../../models/giveaway");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  subCommand: "giveaway.end",

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */
  async execute(interaction, client) {
    const id = interaction.options.getString("giveaway");

    const data = await giveaway.findOne({ MessageID: id, Active: true });
    if (!data)
      return interaction.reply({
        content: "This giveaway does not exist",
        ephemeral: true,
      });

    const winners = data.Participants.sort(
      () => Math.random() - Math.random(),
    ).slice(0, data.Winners);
    const winnerMentions = winners.map((winner) => `<@${winner}>`).join(" ");
    const channel = client.channels.cache.get(data.ChannelID);
    const message = await channel.messages.fetch(data.MessageID);

    const participants = data.Participants.length;
    const btn = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("giveaway-join")
        .setLabel(`🎉 Participate (${participants.toLocaleString()})`)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

    const embed = new EmbedBuilder()
      .setTitle("🎉 Giveaway Ended! [RESULTS]")
      .setDescription(
        "The winners of this giveaway are tagged above! Congratulations! 🎉",
      )
      .setColor(parseInt(client.config.color.replace("#", ""), 16))
      .addFields({ name: "Prize", value: data.Prize })
      .setFooter({ text: `Participants: ${participants.toLocaleString()}` });

    await message.edit({ components: [btn] });
    await message.reply({ content: `${winnerMentions}`, embeds: [embed] });

    data.Active = false;
    await data.save();

    interaction.reply({
      content: "Giveaway was ended and winners rolled.",
      ephemeral: true,
    });
  },
};
