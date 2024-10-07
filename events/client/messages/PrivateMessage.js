const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");
const config = require("../../../config.json");
const Ticket = require("../../../models/tickets");
const Mutes = require("../../../models/mutes");

const Modlogs = require("../../../models/modlogs");

/**
 * @param { Guild } guild
 */

module.exports = {
  name: "messageCreate",

  async execute(message, guild) {
    if (message.author.bot) return;
    if (message.channel.type != ChannelType.DM) return;
    const flex = message.client.guilds.cache.get(config.guildId);

    const category = guild.channels.cache.get(
      config.channel_categories.modmail.tickets,
    );

    const Btn = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket-close")
        .setLabel("🔒 Close Ticket")
        .setStyle(ButtonStyle.Danger),
    );

    const ticketEmbed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTitle("Message recieved from user")
      .setColor(0x00ff00)
      .setDescription(
        message.content ? message.content : "User sent an attachment",
      )
      .setTimestamp()
      .setFooter({ text: `${message.author.username}: ${message.author.id}` });

    if (message.attachments.size > 0) {
      ticketEmbed.addFields({
        name: "Attachments",
        value: message.attachments
          .map((attachment) => `🔗 [${attachment.name}](${attachment.url})`)
          .join("\n"),
      });
    }

    const Mute = await Mutes.findOne({
      MemberID: message.author.id,
      MutedUntil: { $gte: Date.now() },
    });
    const modlogs = await Modlogs.find({ MemberID: message.author.id }).limit(
      10,
    );

    const userInfo = new EmbedBuilder()
      .setDescription(
        `This message contains all information about **${message.author.username}**. \nIncluding last moderation actions, warnings, and more.\n\nMessages starting with \`=\` will be ignored and not be sent to user. Can be used for internal messages or notes.`,
      )
      .addFields(
        {
          name: "Account created",
          value: `<t:${parseInt(message.author.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Joined server",
          value: `<t:${parseInt(flex.members.cache.get(message.author.id).joinedTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Roles",
          value: `${flex.members.cache
            .get(message.author.id)
            .roles.cache.map((role) => `<@&${role.id}>`)
            .join("\n")}`,
          inline: true,
        },
        {
          name: "Bot account",
          value: message.author.bot ? "Yes" : "No",
          inline: true,
        },
      )
      .setTimestamp()
      .setFooter({ text: `${message.author.username}: ${message.author.id}` });

    if (Mute) {
      userInfo.addFields(
        {
          name: "Mute expiries",
          value: `<t:${parseInt(Mute.MutedUntil / 1000)}:R>`,
          inline: true,
        },
        { name: "Muted by", value: `<@${Mute.MutedBy}>`, inline: true },
        { name: "Reason", value: Mute.Reason.toString(), inline: true },
      );
    }
    if (modlogs) {
      userInfo.addFields(
        {
          name: `Mod logs`,
          value: modlogs
            .map(
              (log) =>
                `> **${log.Action}** by <@${log.Moderator}> reason: ${log.Reason}`,
            )
            .join("\n"),
          inline: true,
        },
        {
          name: "Timesamp",
          value: modlogs
            .map((log) => `<t:${parseInt(log.Date / 1000)}:R>`)
            .join("\n"),
          inline: true,
        },
      );
    }

    const ticket = await Ticket.findOne({
      MemberID: message.author.id,
      Closed: false,
    });
    const totalTickets = await Ticket.find({ Closed: false }).countDocuments();

    if (!ticket) {
      message.channel.send(
        `Hey, I'm a Robot! The messages you send me (including the one you just sent) will be visible to all the moderators of **${config.flex}**. I will DM you back when they reply.\n\n` +
          ":question: **If you have a question** please ask what your question is if you haven't already. The moderators are volunteers and can only help you with questions related to the server or the events happening in it.\n\n" +
          ":shield: **If you want to report someone** please provide the user ID and proof of the rule breaking if you haven't already.\n\n" +
          ':white_check_mark: **If you find the answer to your question or no longer want to report someone** before a moderator has had the time to look at your message, please just say "I no longer need help" so we can close your help request.\n\n' +
          "*Please keep chatter to a minimum and focus on what you like to ask or report. Messages unrelated to the above options can get very spammy and hard to manage. As a result, we may take action on you for abusing modmail.*",
      );

      category.threads
        .create({
          name: `ticket: #${totalTickets + 1} - ${message.author.username}`,
          type: "GUILD_PRIVATE_THREAD",
          message: {
            components: [Btn],
            embeds: [ticketEmbed, userInfo],
          },
          reason: "Ticket created by user after sending dm to modmail",
        })
        .then((thread) => {
          new Ticket({
            Id: totalTickets + 1,
            MemberID: message.author.id,
            MemberName: message.author.username,
            ChannelID: thread.id,
            Closed: false,
          }).save();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      if (message.content.toLowerCase() === "i no longer need help") {
        ticket.Closed = true;
        ticket.ClosedAt = new Date();
        ticket.CloseReason = "Closed by the user".toString();
        ticket.ClosedBy = message.author.username;
        ticket.save();

        category.threads.cache.get(ticket.ChannelID);
        const attachment = await createTranscript(
          category.threads.cache.get(ticket.ChannelID),
          {
            limit: -1,
            returnType: "attachment",
            title: `Ticket#${ticket.Id}`,
            fileName: `Ticket#${ticket.Id}.html`,
          },
        );
        await flex.channels.cache.get("1238443933105782894").send({
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
                { name: "Reason", value: "Closed by the user", inline: true },
              )
              .setTimestamp(ticket.CreatedAt)
              .setFooter({ text: "Ticket was created" }),
          ],
          files: [attachment],
        });
        category.threads.cache.get(ticket.ChannelID).delete();
        message.channel.send(
          "Your ticket has been closed. If you need further assistance, feel free to send another message.",
        );
        return;
      }
      category.threads.cache
        .get(ticket.ChannelID)
        .send({ embeds: [ticketEmbed] });
    }
  },
};
