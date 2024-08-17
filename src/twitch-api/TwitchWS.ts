import WebSocket from "ws";
import {
  EventQueue,
  TwitchWSWelcomeEvent,
  TwitchStreamOnlineEvent,
} from "./EventQueue";

class TwitchWS {
  private WS_URL = "wss://eventsub.wss.twitch.tv/ws";
  private websocket: WebSocket;
  private queue: EventQueue;

  constructor(queue: EventQueue) {
    this.queue = queue;

    this.websocket = new WebSocket(this.WS_URL);

    this.websocket.on("open", () => {
      console.log("Log: Connected to Twitch Websocket server!");
    });

    this.websocket.on("close", () => {
      console.log("Log: Disconnected from Twitch Websocket server!");
    });

    this.websocket.on("message", (rawMessage: string) => {
      const message = JSON.parse(rawMessage) as Message;
      const messageType = message.metadata.message_type;
      // console.log(`Log: Received ${messageType} message.`);

      if (messageType === "session_welcome") {
        const payload = message.payload as SessionWelcomePayload;

        const sessionWelcomeEvent: TwitchWSWelcomeEvent = {
          type: "twitch-ws-welcome",
          sessionId: payload.session.id,
        };

        this.queue.publish(sessionWelcomeEvent);
      } else if (messageType === "notification") {
        const payload = message.payload as EventNotificationPayload;

        console.log("Log: Received notification message:");
        console.log(message);

        if (payload.subscription.type === "stream.online") {
          const streamOnlineEvent: TwitchStreamOnlineEvent = {
            type: "twitch-stream-online",
            streamerName: payload.event.broadcaster_user_name,
          };

          this.queue.publish(streamOnlineEvent);
        } else {
          console.log(
            `Log: Unknown subscription type '${payload.subscription.type}'.`
          );
        }
      } else if (messageType === "session_keepalive") {
        // Known type, lazy to handle
      } else {
        console.log("Log: Received unknown message type.");
        console.log(message);
      }
    });
  }
}

export { TwitchWS };

// Types
type Message = {
  metadata: Metadata;
  payload: SessionWelcomePayload | EventNotificationPayload;
};

type Metadata = {
  message_id: string;
  message_type: string;
  message_timestamp: string;
};

type Session = {
  id: string;
  status: string;
  keepalive_timeout_seconds: number;
  reconnect_url: string;
  connected_at: string;
};

type SessionWelcomePayload = {
  session: Session;
};

// This is only a small portion of the whole subscription object
type Subscription = {
  id: string;
  status: string;
  type: string;
  cost: number;
};

type Event = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
};

type EventNotificationPayload = {
  subscription: Subscription;
  event: Event;
};
