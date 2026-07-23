import { MessageFlags, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { buildMyThemesPayload } from "../../payloads/buildMyThemesPayload.js";

export const data = new SlashCommandBuilder().setName("mythemes").setDescription("View your saved themes");

export async function execute(interaction: ChatInputCommandInteraction) {
	const payload = await buildMyThemesPayload(interaction.user.id);
	return interaction.reply({ ...payload, flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
}
