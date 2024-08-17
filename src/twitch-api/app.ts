import { config } from "../config";
import {
  EventQueue,
  TwitchWSWelcomeEvent,
  ClientInteractionEvent,
  TwitchOnlineSubscribe,
} from "./EventQueue";
import { JSONFile } from "./JSONFile";
import { TwitchApi } from "./TwitchApi";
import { TwitchWS } from "./TwitchWS";
import { TwitchTokenProvider } from "./TwitchTokenProvider";
import * as utils from "./utils";

class TwitchApp {
  private jsonFile: JSONFile;
  private tokenProvider: TwitchTokenProvider;
  private twitchApi: TwitchApi;
  private queue: EventQueue;
  private wsSessionId: string | undefined;
  private streamers: string[] | undefined;

  constructor(queue: EventQueue) {
    this.jsonFile = new JSONFile("secrets");
    this.tokenProvider = new TwitchTokenProvider(
      config.TWITCH_CLIENT_ID,
      config.TWITCH_CLIENT_SECRET,
      config.TWITCH_AUTH_CODE
    );
    this.twitchApi = new TwitchApi(this.jsonFile, config.TWITCH_CLIENT_ID);

    this.queue = queue;
  }

  // Event Handlers
  async sessionWelcomeHandler(event: TwitchWSWelcomeEvent) {
    this.wsSessionId = event.sessionId;
    this.subscribeToStreamers(this.wsSessionId);
  }

  async clientInteractionHandler(event: ClientInteractionEvent) {
    this.streamers = event.streamerList;

    await utils.grabTokenAndSave(this.tokenProvider, this.jsonFile);

    if (!this.wsSessionId) {
      new TwitchWS(this.queue);
    } else {
      this.subscribeToStreamers(this.wsSessionId);
    }
  }

  async subscribeToStreamers(sessionId: string) {
    if (!this.streamers) {
      console.log("Log: No streamer names were provided to use for subbing.");
      return;
    }

    const broadcasterIds = await this.twitchApi.getBroadcasterIds(
      this.streamers
    );

    const subscriptions = broadcasterIds.map((broadcasterId) => {
      // More sub types can be added here in variables
      const online = this.twitchApi.subscribeStreamOnline(
        broadcasterId,
        sessionId
      );

      // Additional sub types can be added to the array
      return Promise.all([online]).then((_) => {});
    });

    return Promise.all(subscriptions).then((_) => {
      console.log("Log: Twitch subscriptions completed.");
      const subscriptionsDone: TwitchOnlineSubscribe = {
        type: "twitch-online-subscribe",
      };
      this.queue.publish(subscriptionsDone);
    });
  }
}

export { TwitchApp };
