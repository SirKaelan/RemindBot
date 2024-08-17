import * as ping from "./ping";
import * as notify from "./notify";

// An object of all bot commands
export const commands = {
  ping, // { data: instance of SlashCommandBuilder, execute: async func }
  notify,
};
