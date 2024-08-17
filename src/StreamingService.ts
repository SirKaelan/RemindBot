import { TwitchApp } from "./twitch-api";
import { CommandInteraction } from "discord.js";
import {
  EventQueue,
  EventHandlerReducer,
  TwitchStreamOnlineEvent,
  TwitchOnlineSubscribe,
} from "./twitch-api/EventQueue";

class StreamingService {
  private twitchApp: TwitchApp;
  public queue: EventQueue;
  private discordInteraction: CommandInteraction;

  constructor(discordInteraction: CommandInteraction) {
    this.discordInteraction = discordInteraction;
    const eventHandlerReducer: EventHandlerReducer = (event) => {
      switch (event.type) {
        case "twitch-ws-welcome":
          return this.twitchApp.sessionWelcomeHandler(event);
        case "twitch-stream-online":
          return this.streamOnlineHandler(event);
        case "client-interaction":
          return this.twitchApp.clientInteractionHandler(event);
        case "twitch-online-subscribe":
          return this.onlineSubscribeHandler(event);
      }
    };

    this.queue = new EventQueue(eventHandlerReducer);

    this.twitchApp = new TwitchApp(this.queue);
    console.log("Starting Twitch App...");
  }

  setDiscordInteraction(discordInteraction: CommandInteraction) {
    this.discordInteraction = discordInteraction;
  }

  async streamOnlineHandler(event: TwitchStreamOnlineEvent) {
    await this.discordInteraction.channel?.send(
      `Streamer ${event.streamerName} has come online!`
    );
  }

  async onlineSubscribeHandler(event: TwitchOnlineSubscribe) {
    await this.discordInteraction.reply({
      content: "Successfully subscribed to streamer!",
      ephemeral: true,
    });
  }
}

export { StreamingService };
