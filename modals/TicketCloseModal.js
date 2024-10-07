const { EmbedBuilder } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");
const Ticket = require("../models/tickets");
const config = require("../config.json");

module.exports = {
  id: "TicketCloseModal",
  developer: false,
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const ticketId = interaction.fields
      .getTextInputValue("TicketIDField")
      .toString();
    const reason = interaction.fields.getTextInputValue("TicketReasonField");

    const ticket = await Ticket.findOne({
      _id: ticketId,
    });

    const member = interaction.guild.members.cache.get(ticket.MemberID);

    try {
      member.send({
        content: `Your ticket has been closed by ${interaction.user}. \nReason: **${reason}**`,
      });
      interaction.reply({
        content: "This ticket was successfully closed.",
      });

      //TODO: Upload transcript to cdn and send the link to the logs channel
      const attachment = await createTranscript(interaction.channel, {
        limit: -1,
        returnType: "attachment",
        title: `Ticket#${ticket.Id}`,
        fileName: `Ticket#${ticket.Id}.html`,
      });
      await interaction.guild.channels.cache
        .get(config.channel_categories.modmail.ticket_logs)
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle(`📝 | Transcript of: Ticket#${ticket.Id}`)
              .addFields(
                {
                  name: "Created By",
                  value: `<@${ticket.MemberID}>`,
                  inline: true,
                },
                {
                  name: "Closed By",
                  value: `<@${interaction.user.id}>`,
                  inline: true,
                },
                {
                  name: "Reason",
                  value: reason,
                  inline: true,
                },
              )
              .setTimestamp(ticket.CreatedAt)
              .setFooter({
                text: "Ticket was created",
              }),
          ],
          files: [attachment],
        });
      setTimeout(() => {
        interaction.channel.delete();
      }, 5000);
    } catch (e) {
      console.log(e);
    }

    ticket.Closed = true;
    ticket.ClosedAt = new Date();
    ticket.ClosedBy = interaction.user.id;
    ticket.CloseReason = reason.toString();
    await ticket.save();
  },
};
