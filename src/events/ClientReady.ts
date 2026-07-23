import { REST, Routes } from "discord.js";
import type { Client } from "discord.js";
import { commands } from "../commands/index.js";

export async function onClientReady(c: Client<true>) {
	console.log(`[READY] Logged in as ${c.user.tag} (ID: ${c.user.id})`);
	console.log(`[READY] Bot is active across ${c.guilds.cache.size} guilds.`);

	const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN ?? "");
	await rest.put(
		Routes.applicationCommands(c.user.id),
		{ body: commands.map((cmd) => cmd.data) },
	);
	console.log("[COMMANDS] Slash commands registered successfully.");
}
