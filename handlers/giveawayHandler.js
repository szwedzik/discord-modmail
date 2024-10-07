const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const giveaway = require("../models/giveaway");

async function giveawayHandler(client) {
  setInterval(async () => {
    try {
      const giveaways = await giveaway.find({ Active: true });
      if (!giveaways) return;
      giveaways.forEach(async (giveaway) => {
        const channel = client.channels.cache.get(giveaway.ChannelID);
        if (!channel) return;

        const message = await channel.messages.fetch(giveaway.MessageID);
        if (!message) return;

        const end = giveaway.Ends;
        if (Date.now() >= end) {
          const winners = giveaway.Participants.sort(
            () => Math.random() - Math.random(),
          ).slice(0, giveaway.Winners);
          const winnerMentions = winners
            .map((winner) => `<@${winner}>`)
            .join(" ");
          const participants = giveaway.Participants.length;

          const embed = new EmbedBuilder()
            .setTitle("🎉 Giveaway Ended! [RESULTS]")
            .setDescription(
              "The winners of this giveaway are tagged above! Congratulations! 🎉",
            )
            .setColor(parseInt(client.config.color.replace("#", ""), 16))
            .addFields({ name: "Prize", value: giveaway.Prize })
            .setFooter({
              text: `Participants: ${participants.toLocaleString()}`,
            });

          const btn = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("giveaway-join")
              .setLabel(`🎉 Participate (${participants.toLocaleString()})`)
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true),
          );

          await message.edit({ components: [btn] });
          await message.reply({
            content: `${winnerMentions}`,
            embeds: [embed],
          });

          giveaway.Active = false;
          await giveaway.save();
        }
      });
    } catch (error) {
      console.error(error);
    }
  }, 1000);
}

module.exports = { giveawayHandler };
