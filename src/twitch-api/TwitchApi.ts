import { JSONFile, JSONTokenFormat } from "./JSONFile";
import axios, { AxiosError } from "axios";

type TwitchUser = {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email: string;
  created_at: string;
};

type TwitchUserResponse = {
  data: TwitchUser[];
};

class TwitchApi {
  private jsonFile: JSONFile;
  private EVENTSUB_SUBSCRIPTIONS_URL =
    "https://api.twitch.tv/helix/eventsub/subscriptions";
  private TWITCH_USERS_URL = "https://api.twitch.tv/helix/users";
  private CLIENT_ID: string;

  constructor(jsonFile: JSONFile, clientId: string) {
    this.jsonFile = jsonFile;
    this.CLIENT_ID = clientId;
  }

  async getBroadcasterIds(streamers: string[]): Promise<string[]> {
    const userTokenData: JSONTokenFormat = this.jsonFile.read();
    const userToken = userTokenData.access_token;

    const streamersParamList = streamers.reduce(
      (prev, curr, i) => `${prev}${i === 0 ? "" : "&"}login=${curr}`,
      ""
    );

    const response = await axios.get<TwitchUserResponse>(
      `${this.TWITCH_USERS_URL}?${streamersParamList}`,
      {
        headers: {
          Authorization: `Bearer ${userToken!}`,
          "Client-Id": this.CLIENT_ID,
        },
      }
    );

    return response.data.data.map((twitchUser) => twitchUser.id);
  }

  async subscribeStreamOnline(
    broadcasterUserId: string,
    sessionId: string
  ): Promise<void> {
    const userTokenData: JSONTokenFormat = this.jsonFile.read();
    const userToken = userTokenData.access_token;

    const postData = {
      type: "stream.online",
      version: "1",
      condition: {
        broadcaster_user_id: broadcasterUserId,
      },
      transport: {
        method: "websocket",
        session_id: sessionId,
      },
    };

    try {
      const response = await axios.post(
        this.EVENTSUB_SUBSCRIPTIONS_URL,
        postData,
        {
          headers: {
            Authorization: `Bearer ${userToken!}`,
            "Client-Id": this.CLIENT_ID,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Log: Subscribe stream online response.");
      console.log(response.data);
    } catch (e) {
      const err = e as AxiosError;
      console.log("EXCEPTION:");
      console.log(err.response?.data);
    }
  }
}

export { TwitchApi };
