## Description

This project is a Discord bot that receives events from the Twitch API and notifies you when a streamer has come online. The main focus on this project was to understand how to integrate my own codebase with an API and how to create a Discord bot with very basic functionality.

## Available Scripts

In the project, you can run:

### `npm run build`

This compiles the typescript code into javascript code and puts it in a `dist` folder

### `npm start`

This runs the compiled javascript file and the Discord bot will boot up

## Important

You will need to create a `.env` file in the <ins>root directory</ins> of the project with exactly this format:

```
DISCORD_BOT_TOKEN=<your discord token>
DISCORD_CLIENT_ID=<your discord client id>
TWITCH_CLIENT_ID=<your twitch client id>
TWITCH_CLIENT_SECRET=<your twitch client secret>
TWITCH_AUTH_CODE=<your twitch authorization code>
```

Replace the values for these fields, the tokens/ids can be received from Discord's and Twitch's websites.
