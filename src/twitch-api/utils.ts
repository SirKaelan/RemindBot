import { JSONTokenFormat, JSONFile } from "./JSONFile";
import { TwitchTokenProvider } from "./TwitchTokenProvider";

const calculateExpiration = (tokenTime: number): number => {
  // Everything is in "seconds"
  const currentTime = Math.floor(Date.now() / 1000);
  const tokenExpirationTime = currentTime + tokenTime - 300;
  return tokenExpirationTime;
};

const grabTokenAndSave = async (
  tokenProvider: TwitchTokenProvider,
  jsonFile: JSONFile
) => {
  if (!jsonFile.fileExists()) {
    // If json file doesn't exist, grab fresh new token alongside a refresh token
    const userTokenData = await tokenProvider.getUserTokenData();

    if (!userTokenData) {
      console.log(
        "Log: Couldn't fetch brand new user token, probably bad auth code."
      );
      return;
    }

    const tokenDataToBeSaved: JSONTokenFormat = {
      access_token: userTokenData.access_token,
      expiration_date: calculateExpiration(userTokenData.expires_in),
      refresh_token: userTokenData.refresh_token,
    };

    jsonFile.write(tokenDataToBeSaved);
  } else {
    // If json file exists check validity of token, if it's rip, get new one
    const jsonTokenData = jsonFile.read();

    // If user token has expired => get new one
    if (jsonTokenData.expiration_date < Date.now() / 1000) {
      console.log("Token expired!");
      const newUserTokenData = await tokenProvider.refreshUserToken(
        jsonTokenData.refresh_token
      );

      if (!newUserTokenData) {
        console.log("Log: Couldn't refresh token, probably bad auth code.");
        return;
      }

      const newTokenDataToBeSaved: JSONTokenFormat = {
        access_token: newUserTokenData.access_token,
        expiration_date: calculateExpiration(newUserTokenData.expires_in),
        refresh_token: newUserTokenData.refresh_token,
      };

      jsonFile.write(newTokenDataToBeSaved);
      return;
    }
  }
};

export { grabTokenAndSave };
