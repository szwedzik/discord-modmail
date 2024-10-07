const {
  EmbedBuilder,
  AttachmentBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const userLevels = require("../../models/userLevels");
const config = require("../../config.json");
const { profileImage } = require("discord-arts");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("🔍 Check your level and exp progress"),

  async execute(interaction, client) {
    if (interaction.channel.id !== config.channel_categories.commands) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `This command can be used only in this channel: ${interaction.guild.channels.cache.get(config.channel_categories.commands)}`,
            )
            .setColor(parseInt(client.config.color.replace("#", ""), 16)),
        ],
        ephemeral: true,
      });
    }

    try {
      await interaction.deferReply();

      const targetMember = interaction.member;

      const user = await userLevels.findOne({
        UserId: targetMember.user.id,
      });

      if (!user) {
        await interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt(client.config.color.replace("#", ""), 16))
              .setDescription(
                `You are not ranked yet. Start chatting to get ranked!`,
              ),
          ],
        });
        return;
      }

      const presenceStatus =
        targetMember.presence && targetMember.presence.status
          ? targetMember.presence.status
          : "offline";
      const users = await userLevels.find().sort({ Level: -1, Xp: -1 });
      const rank =
        users.findIndex((user) => user.UserId === targetMember.user.id) + 1;
      const roles = targetMember.roles.cache;
      let badge = [];
      let tag = null;
      let color = null;
      if (roles.has("1238150413522305064")) {
        badge = [
          "https://raw.githubusercontent.com/LyxcodeTutorials/discord-emojis/main/olddiscordmod.png",
        ];
        tag = "Discord Moderator";
        color = "#5865f2";
      } else if (roles.has("1221573908629815336")) {
        badge = [
          "https://raw.githubusercontent.com/LyxcodeTutorials/discord-emojis/main/discordmod.png",
        ];
        tag = "Flex Staff";
        color = "#fc964b";
      }
      const buffer = await profileImage(targetMember.id, {
        customTag: tag,
        tagColor: color,
        customBadges: badge,
        borderColor: ["#fc964b", "#f67f04"],
        badgesFrame: true,
        presenceStatus: presenceStatus,
        disableProfileTheme: true,
        removeAvatarFrame: false,
        customBackground:
          "https://cdn.discordapp.com/attachments/1223032235259723837/1232162454927315016/image.png?ex=664f5875&is=664e06f5&hm=61f542c0e72f8b34e767f98fb34c869b0000d2145bea0bdfd95d3f920821ebd3&",
        moreBackgroundBlur: 5,
        rankData: {
          currentXp: user.Xp || 0,
          requiredXp: (user.Level === 0 ? 1000 : user.Level * 3000) || 1000,
          level: user.Level,
          barColor: "#fc964b",
          rank: rank,
          autoColorRank: true,
        },
      });

      const attachment = new AttachmentBuilder(buffer, {
        name: "profile.png",
      });

      await interaction.followUp({
        files: [attachment],
      });
    } catch (error) {
      console.error(error);
      return;
    }
  },
};
