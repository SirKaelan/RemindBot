import { CommandInteraction, SlashCommandBuilder } from "discord.js";

// Creates API-compatible JSON data object for a command, or something
export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

// I guess this is for when the command gets used (or interacted with)
// Kind of like setting up event handlers
export const execute = async (interaction: CommandInteraction) => {
  return interaction.reply("Pong!");
};
