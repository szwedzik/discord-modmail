const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { sendLogs } = require("../../Utils/SendLogs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge a certain amount of messages.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to purge")
        .setRequired(true),
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to purge messages from")
        .setRequired(false),
    ),

  async execute(interaction) {
    const user = interaction.options.getMember("user");
    const amount = interaction.options.getInteger("amount");

    const logEmbed = new EmbedBuilder()
      .setTitle("Messages Deleted")
      .setThumbnail("https://cdn-icons-png.freepik.com/512/1161/1161388.png")
      .setDescription(
        `${amount} messages were deleted in ${interaction.channel}.`,
      )
      .addFields({
        name: "Moderator",
        value: `${interaction.user} (${interaction.user.id})`,
        inline: true,
      })
      .setTimestamp()
      .setFooter({
        text: "Moderation Log ",
        iconURL: "https://cdn-icons-png.freepik.com/512/1161/1161388.png",
      });

    if (user) {
      interaction.channel.messages.fetch({ limit: amount }).then((messages) => {
        const userMessages = messages.filter(
          (msg) => msg.author.id === user.id,
        );
        interaction.channel
          .bulkDelete(userMessages, true)
          .then(() => {
            interaction.reply({
              content: `${userMessages.size} messages were removed from ${user}.`,
            });
          })
          .catch(() => {
            interaction.reply({
              content: "An error occurred while purging messages.",
              ephemeral: true,
            });
          });
      });
      logEmbed.setDescription(
        `${amount} messages were deleted from ${user} in ${interaction.channel}.`,
      );
    } else {
      interaction.channel
        .bulkDelete(amount, true)
        .then(() => {
          interaction.reply({ content: `${amount} messages were removed.` });
        })
        .catch(() => {
          interaction.reply({
            content: "An error occurred while purging messages.",
            ephemeral: true,
          });
        });
    }

    sendLogs(interaction, "Message Logs", interaction.user.username, logEmbed);
  },
};
