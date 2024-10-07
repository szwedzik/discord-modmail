const {
  SlashCommandBuilder,
  // eslint-disable-next-line no-unused-vars
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const UserLevel = require("../../models/userLevels");
const canvafy = require("canvafy");
const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top")
    .setDescription("🔍 View the server's leaderboard"),

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.channel.id !== config.channel_categories.commands) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setDescription(
            `This command can be used only in this channel: ${interaction.guild.channels.cache.get(config.channel_categories.commands)}`,
          ),
        ],
        ephemeral: true,
      });
    }

    try {
      await interaction.deferReply();

      const users = await UserLevel.find({
        GuildId: interaction.guild.id,
      }).sort({ Level: -1 });

      if (users.length === 0) {
        await interaction.followUp({
          content: "There are no users in the ranking yet.",
        });
        return;
      }

      const usersData = await Promise.all(
        users.map(async (user, index) => {
          const fetchedUser = await client.users.fetch(user.UserId);
          return {
            top: index + 1,
            tag: fetchedUser.username,
            avatar: fetchedUser.displayAvatarURL({
              format: "png",
              dynamic: true,
            }),
            score: `${user.Level.toString()} (${user.Xp.toString()} XP)`,
          };
        }),
      ).catch((error) => {
        console.error(error);
      });

      const top = await new canvafy.Top()
        .setOpacity(0.5)
        .setScoreMessage("Level")
        .setBackground(
          "image",
          "https://cdn.discordapp.com/attachments/1223032235259723837/1232162454927315016/image.png?ex=6646c6b5&is=66457535&hm=1e3b91f3d3c65fa73aee3ea946b1e0631977b55f4221e2270e4f517b965c2eb2&",
        )
        .setUsersData(usersData)
        .build();

      await interaction.followUp({
        files: [
          {
            attachment: top,
            name: `top-${interaction.user.id}.png`,
          },
        ],
      });
    } catch (error) {
      console.error(error);
      interaction.followUp({
        content: "There was an error while executing this command.",
        ephemeral: true,
      });
    }
  },
};
