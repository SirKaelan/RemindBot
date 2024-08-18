## Description

This project is a Discord bot that receives events from the Twitch API and notifies you when a streamer has come online. The main focus on this project was to understand how to integrate my own codebase with an API and how to create a Discord bot with very basic functionality.

## Available Scripts

In the project, you can run:

### `npm run build`

This compiles the typescript code into javascript code and puts it in a `dist` folder

### `npm start`

This runs the compiled javascript file and the Discord bot will boot up

## Important

You will need to create a `.env` file that contains exactly the fields `DISCORD_BOT_TOKEN`, `DISCORD_CLIENT_ID`, `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET` and `TWITCH_AUTH_CODE`. The values for those fields can be received from both Discord's website and Twitch.
