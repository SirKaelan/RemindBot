import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { StreamingService } from "../StreamingService";
import { ClientInteractionEvent } from "../twitch-api/EventQueue";

let streamingService: StreamingService | undefined;

const data = new SlashCommandBuilder()
  .setName("notify")
  .setDescription(
    "Write Twitch streamer names you want to get notified of when they come online."
  )
  .addStringOption((option) =>
    option
      .setName("streamer")
      .setDescription("Write the name of a Twitch streamer.")
      .setRequired(true)
  );

const execute = async (interaction: CommandInteraction) => {
  const streamerName = interaction.options.get("streamer")?.value;

  if (!streamingService) streamingService = new StreamingService(interaction);
  else streamingService.setDiscordInteraction(interaction); // Set a new instance

  const discordEvent: ClientInteractionEvent = {
    type: "client-interaction",
    streamerList: [streamerName as string],
  };

  streamingService.queue.publish(discordEvent);
};

export { data, execute };
