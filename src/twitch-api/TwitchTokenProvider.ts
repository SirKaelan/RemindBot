import axios, { AxiosError } from "axios";

type UserTokenRequestFormat = {
  client_id: string;
  client_secret: string;
  code: string;
  grant_type: "authorization_code";
  redirect_uri: string;
};

type UserTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: string;
};

type RefreshTokenRequestFormat = {
  client_id: string;
  client_secret: string;
  grant_type: "refresh_token";
  refresh_token: string;
};

type RefreshTokenResponse = UserTokenResponse;

class TwitchTokenProvider {
  private GENERAL_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
  private CLIENT_ID: string;
  private CLIENT_SECRET: string;
  private AUTH_CODE: string;

  constructor(clientId: string, clientSecret: string, authCode: string) {
    this.CLIENT_ID = clientId;
    this.CLIENT_SECRET = clientSecret;
    this.AUTH_CODE = authCode;
  }

  // Gets refresh and access token with auth code
  async getUserTokenData(): Promise<UserTokenResponse | undefined> {
    const postData: UserTokenRequestFormat = {
      client_id: this.CLIENT_ID,
      client_secret: this.CLIENT_SECRET,
      code: this.AUTH_CODE,
      grant_type: "authorization_code",
      redirect_uri: "https://www.google.com/",
    };

    try {
      const response = await axios.post<UserTokenResponse>(
        this.GENERAL_TOKEN_URL,
        postData
      );
      return response.data;
    } catch (e) {
      const err = e as AxiosError;
      console.log("EXCEPTION:");
      console.log(err.response?.data);
    }
  }

  // Get new user token with refresh token
  async refreshUserToken(
    refreshToken: string
  ): Promise<RefreshTokenResponse | undefined> {
    const postData: RefreshTokenRequestFormat = {
      client_id: this.CLIENT_ID,
      client_secret: this.CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    };

    try {
      const response = await axios.post<RefreshTokenResponse>(
        this.GENERAL_TOKEN_URL,
        postData
      );
      return response.data;
    } catch (e) {
      const err = e as AxiosError;
      console.log("EXCEPTION:");
      console.log(err.response?.data);
    }
  }
}

export { TwitchTokenProvider };
