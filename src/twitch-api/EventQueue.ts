// Adapter class for event queue libraries
import fastq from "fastq";
import type { queueAsPromised } from "fastq";

type WSEvent =
  | TwitchWSWelcomeEvent
  | TwitchStreamOnlineEvent
  | ClientInteractionEvent
  | TwitchOnlineSubscribe;

// All custom event types
type TwitchWSWelcomeEvent = {
  type: "twitch-ws-welcome";
  sessionId: string;
};

type TwitchStreamOnlineEvent = {
  type: "twitch-stream-online";
  streamerName: string;
};

type ClientInteractionEvent = {
  type: "client-interaction";
  streamerList: string[];
};

type TwitchOnlineSubscribe = {
  type: "twitch-online-subscribe";
};

type EventHandlerReducer = (event: WSEvent) => Promise<void>;

class EventQueue {
  private queue: queueAsPromised<WSEvent, void>;

  constructor(eventReducer: EventHandlerReducer) {
    this.queue = fastq.promise(eventReducer, 1);
  }

  publish(event: WSEvent): void {
    this.queue.push(event).catch((err) => console.log(err));
  }
}

export {
  EventQueue,
  WSEvent,
  EventHandlerReducer,
  TwitchWSWelcomeEvent,
  TwitchStreamOnlineEvent,
  ClientInteractionEvent,
  TwitchOnlineSubscribe,
};
