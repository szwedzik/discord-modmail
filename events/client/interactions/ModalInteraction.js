const { InteractionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.type !== InteractionType.ModalSubmit) return;

    const modal = client.modals.get(interaction.customId);

    if (!modal) return;

    if (modal == undefined) return;

    //if (modal.permission && !interaction.member.permissions.has(modal.permission)) return interaction.reply({ content: "You don't have permission to use this.", ephemeral: true });

    if (modal.developer && interaction.user.id !== "217566090073473026")
      return interaction.reply({
        content: "You cannot use this command.",
        ephemeral: true,
      });

    modal.execute(interaction, client);
  },
};
