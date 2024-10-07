const { EmbedBuilder } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");

const Ticket = require("../../../models/tickets");
const config = require("../../../config.json");

module.exports = {
  name: "messageCreate",

  async execute(message, guild) {
    const { interaction } = message;
    const category = guild.channels.cache.get(
      config.channel_categories.modmail.tickets,
    );

    if (message.author.bot) return;
    if (message.channel.parentId !== category.id) return;

    if (message.content.startsWith("=")) return;

    const ticket = await Ticket.findOne({ ChannelID: message.channelId });
    if (!ticket) return;

    if (!message.guild.members.cache.get(ticket.MemberID)) {
      message.channel
        .send({
          content: `Looks like <@${ticket.MemberID}> left the server. \nTicket will be automatically closed in 5 seconds`,
        })
        .then(() => {
          ticket.Closed = true;
          ticket.ClosedAt = Date.now();
          ticket.CloseReason = "User left the server".toString();
          ticket.ClosedBy = message.author.id;
          ticket.save();

          const attachment = createTranscript(interaction.channel, {
            limit: -1,
            returnType: "attachment",
            title: `Ticket#${ticket.Id}`,
            fileName: `Ticket#${ticket.Id}.html`,
          });
          message.guild.channels.cache.get("1238443933105782894").send({
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
                    value: `<@${message.author.id}>`,
                    inline: true,
                  },
                  {
                    name: "Reason",
                    value:
                      "Ticket was automatically closed due to ticket author leaving the server.",
                    inline: true,
                  },
                )
                .setTimestamp(ticket.CreatedAt)
                .setFooter({ text: "Ticket was created" }),
            ],
            files: [attachment],
          });

          setTimeout(() => {
            message.channel.delete();
          }, 5000);
        });
    }

    const member = await guild.users.fetch(ticket.MemberID);
    if (!member) return;

    const replyEmbed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTitle("Message sent to user")
      .setColor(0xff0000)
      .setDescription(message.content)
      .setTimestamp()
      .setFooter({ text: `${message.author.username}: ${message.author.id}` });

    try {
      message.delete();
      message.channel.send({
        embeds: [replyEmbed],
      });
      member.send({
        content: `**Moderator ${message.author} replied to your ticket**\nWith message: **${message.content}**`,
      });
    } catch (e) {
      console.log(e);
    }
  },
};
