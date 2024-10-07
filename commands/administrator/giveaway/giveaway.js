const { SlashCommandBuilder } = require("discord.js");
const giveawayDuration = [
  {
    name: "1 Day",
    value: "1d",
  },
  {
    name: "2 Days",
    value: "2d",
  },
  {
    name: "1 Week",
    value: "1w",
  },
  {
    name: "2 Weeks",
    value: "2w",
  },
  {
    name: "1 Month",
    value: "1m",
  },
];
module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Create a giveaway")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Starts a giveaway")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to create the giveaway in")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("The description for the giveaway")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("prize")
            .setDescription("The prize for the giveaway")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription("The number of winners for the giveaway")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("The duration of the giveaway")
            .addChoices(giveawayDuration)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("end")
        .setDescription("Ends a giveaway")
        .addStringOption((option) =>
          option
            .setName("giveaway")
            .setDescription("Provide the giveaway ID to end the giveaway")
            .setRequired(true),
        ),
    ),

  async execute(interaction) {},
};
