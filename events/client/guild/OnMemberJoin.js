const { EmbedBuilder } = require("discord.js");
const Mutes = require("../../../models/mutes");

module.exports = {
  name: "guildMemberAdd",

  async execute(interaction, client) {
    // check how many members did join within the last 1 minute
    // const members = await interaction.guild.members.fetch();
    // const joined = members.filter(member => (Date.now() - member.joinedTimestamp) < 60000);
    // const antiRaidTreshold = 5;
    // if(joined.size > antiRaidTreshold) {
    //     // fetch all channels where everyone can send messages
    //     const channels = interaction.guild.channels.cache.filter(channel => channel.permissionsFor(interaction.guild.roles.everyone).has('SEND_MESSAGES'));
    //     // iterate over all channels and add them to a collection
    //     const channelCollection = channels.map(channel => channel);
    //     // lock all the channels in channelCollection
    //     channelCollection.forEach(channel => channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SEND_MESSAGES: false }));
    //     // pause all invites
    //     interaction.guild.invites.fetch().then(invites => {
    //         invites.forEach(invite => {
    //             if(invite === interaction.guild.vanityURLCode) return;
    //             invite.delete();
    //         });
    //     });
    //     // after 10 minutes unlock all the channels
    //     setTimeout(() => {
    //         channelCollection.forEach(channel => channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SEND_MESSAGES: true }));
    //     }, 600000);
    // }

    const Muted = await Mutes.findOne({
      MemberID: interaction.user.id,
      MutedUntil: { $gte: Date.now() },
    });
    const logChannel = client.channels.cache.get("1238135434585047091");
    const joinEmbed = new EmbedBuilder()
      .setTitle("New member joined.")
      .setDescription(
        `${interaction.user} (${interaction.user.id}) ${Muted ? `\nWas **re-muted** possibly tried to avoid the mute by leaving the server` : ""}`,
      )
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields(
        { name: "Username", value: interaction.user.username, inline: true },
        {
          name: "Account Created",
          value: `<t:${parseInt(interaction.user.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Bot Account",
          value: interaction.user.bot ? "Yes" : "No",
          inline: true,
        },
      )
      .setColor(0x00ff00)
      .setTimestamp();

    if (Muted) {
      const user = await interaction.guild.members.fetch(interaction.user.id);
      user.timeout(Muted.MutedUntil - Date.now(), Muted.Reason);
      joinEmbed.addFields({
        name: "Mute expiries",
        value: `<t:${parseInt(Muted.MutedUntil / 1000)}:R>`,
        inline: true,
      });
    }

    if (
      logChannel.threads.cache.find(
        (thread) => thread.name === "Members Join Log",
      )
    ) {
      const logThread = logChannel.threads.cache.find(
        (thread) => thread.name === "Members Join Log",
      );
      logThread.send({ embeds: [joinEmbed] });
    } else {
      logChannel.threads.create({
        name: "Members Join Log",
        type: "GUILD_PRIVATE_THREAD",
        message: {
          embeds: [joinEmbed],
        },
      });
    }
  },
};
