const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    const button = client.buttons.get(interaction.customId);
    if (!button) return;
    if (button == undefined) return;
    // if (button.permission && !interaction.member.permissions.has(button.permission)) return interaction.reply({ content: "You cannot use this command.", ephemeral: true });
    if (button.developer && interaction.user.id !== "217566090073473026")
      return interaction.reply({
        content: "You cannot use this button.",
        ephemeral: true,
      });

    button.execute(interaction, client);
  },
};
