const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const {
  Guilds,
  GuildMembers,
  GuildMessages,
  DirectMessages,
  MessageContent,
  GuildPresences,
} = GatewayIntentBits;
const {
  User,
  Channel,
  Message,
  GuildMember,
  ThreadMember,
  GuildMemberManager,
} = Partials;

const client = new Client({
  intents: [
    Guilds,
    GuildMembers,
    GuildMessages,
    DirectMessages,
    MessageContent,
    GuildPresences,
  ],
  partials: [
    User,
    Message,
    GuildMember,
    ThreadMember,
    GuildMemberManager,
    Channel,
  ],
});

const { loadEvents } = require("./Handlers/eventHandler");

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

loadEvents(client);

client.login(client.config.token);
