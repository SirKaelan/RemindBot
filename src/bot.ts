// This file is for initializing the bot

import { Client, GatewayIntentBits, Events, ActivityType } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { config } from "./config";

// 1. Create a new Discord Client and set its intents to determine which events the bot will receive information about. In this example, the bot will receive information about guilds, guild messages, and direct messages:

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  presence: {
    status: "dnd",
  },
});

// 2. Add a console.log when the bot is ready:

client.once(Events.ClientReady, () => {
  console.log("Discord bot is ready! 🤖");
});

// 3. Deploy commands when new guild has been created:

client.on(Events.GuildCreate, async (guild) => {
  await deployCommands({ guildId: guild.id });
});

// 4. Run corresponding command when new user interaction has been created:

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  // I'm not sure what "as keyof typeof" exactly does
  // Must be checking if "commandName" exists in "commands"
  if (commands[commandName as keyof typeof commands]) {
    // This is the first time we make use of "execute"
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

// 5. Log in the client using your token:

client.login(config.DISCORD_BOT_TOKEN);
