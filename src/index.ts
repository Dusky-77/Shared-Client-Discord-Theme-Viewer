import { client } from "./client.js";
import { onClientReady } from "./events/ClientReady.js";
import { onInteractionCreate } from "./events/InteractionCreate.js";

client.once("clientReady", onClientReady);
client.on("interactionCreate", onInteractionCreate);

client.login(process.env.DISCORD_TOKEN);
