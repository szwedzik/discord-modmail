const {
  PermissionFlagsBits,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} = require("discord.js");
const Ticket = require("../models/tickets");
module.exports = {
  id: "ticket-close",
  developer: false,
  permission: PermissionFlagsBits.everyone,

  async execute(interaction) {
    const ticket = await Ticket.findOne({ ChannelID: interaction.channel.id });
    if (!ticket)
      return interaction.reply({
        content: "Ticket not found",
        ephemeral: true,
      });

    const TicketID = new TextInputBuilder()
      .setCustomId("TicketIDField")
      .setLabel("Ticket ID (DO NOT CHANGE)")
      .setValue(ticket._id.toString())
      .setStyle(TextInputStyle.Short);
    const ReasonField = new TextInputBuilder()
      .setCustomId("TicketReasonField")
      .setLabel("Reason")
      .setPlaceholder("Provide a reason before closing the ticket.")
      .setMaxLength(1000)
      .setMinLength(1)
      .setStyle(TextInputStyle.Paragraph);

    const ModalRow = new ActionRowBuilder().addComponents(TicketID);
    const ModalRow2 = new ActionRowBuilder().addComponents(ReasonField);

    const modal = new ModalBuilder()
      .setCustomId("TicketCloseModal")
      .setTitle(`Ticket: ${ticket.MemberName}`)
      .addComponents(ModalRow, ModalRow2);
    await interaction.showModal(modal);
  },
};
