import { MessageFlags, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { userPresetPage } from "../../client.js";
import { buildPresetsPayload } from "../../payloads/buildPresetsPayload.js";

export const data = new SlashCommandBuilder().setName("presets").setDescription("Browse community theme presets");

export async function execute(interaction: ChatInputCommandInteraction) {
	userPresetPage.set(interaction.user.id, 1);
	const payload = await buildPresetsPayload(1);
	return interaction.reply({ ...payload, flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
}
