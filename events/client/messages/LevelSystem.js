const { AttachmentBuilder, ChannelType } = require("discord.js");
const UserLevel = require("../../../models/userlevels");
const { profileImage } = require("discord-arts");
const cooldown = new Set();
const userMessageCount = new Map();
const config = require("../../../config.json");

module.exports = {
  name: "messageCreate",

  async execute(message, client) {
    if (message.channel.type != ChannelType.GuildText) return;
    if (message.author.bot) return;

    const guild = message.guild;
    const userId = message.author.id;
    if (cooldown.has(userId)) return;

    // Anti-Spam
    const messageCount = userMessageCount.get(userId) || 0;
    userMessageCount.set(userId, messageCount + 1);
    setTimeout(() => {
      userMessageCount.delete(userId);
    }, 120000);

    if (messageCount > 20) {
      cooldown.add(userId);
      setTimeout(() => {
        cooldown.delete(userId);
      }, 120000);
      return;
    }

    let user;
    const xpAmount = Math.floor(Math.random() * (10 - 5 + 1) + 5);
    user = await UserLevel.findOneAndUpdate(
      {
        GuildId: guild.id,
        UserId: userId,
      },
      {
        $inc: {
          Xp: xpAmount,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    let { Xp, Level } = user;

    if (Xp >= (Level === 0 ? 1000 : Level * 3000)) {
      cooldown.add(userId);
      Level++;
      Xp = 0;

      const buffer = await profileImage(userId, {
        customTag: `You level up to: ${Level}!`,
      });

      try {
        message.author.send({
          content: `You level up to: ${Level}!`,
          files: [
            new AttachmentBuilder(buffer, {
              name: "profile.png",
            }),
          ],
        });
      } catch (e) {
        console.log(e);
      }

      await UserLevel.updateOne(
        {
          GuildId: guild.id,
          UserId: userId,
        },
        {
          Level: Level,
          Xp: Xp,
        },
      );

      const roles = config.roles.level;
      const role = roles[Level.toString()];
      if (role) {
        const member = await guild.members.fetch(userId);
        const roleToAdd = guild.roles.cache.get(role);
        if (roleToAdd) {
          await member.roles.add(roleToAdd);
        }
      }

      setTimeout(() => {
        cooldown.delete(userId);
      }, 120000);
    }
  },
};
