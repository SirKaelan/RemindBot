// This file is to register the bot commands for a specific server (otherwise the server won't be able to recognize them)

import { REST, Routes } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";

// Array with all commands data
const commandsData = Object.values(commands).map((command) => command.data);

// Grabbing rest client to talk to Discord and setting the bot authorization token
const rest = new REST({ version: "10" }).setToken(config.DISCORD_BOT_TOKEN);

// Guild = Discord Server
type DeployCommandsProps = {
  guildId: string;
};

export const deployCommands = async ({ guildId }: DeployCommandsProps) => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
      { body: commandsData }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};
