import { MessageFlags, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { cooldowns, getThemeState } from "../../client.js";
import { buildThemeContainerPayload } from "../../payloads/buildThemeContainer.js";
import { generatePreviewCanvas } from "../../utils/canvas.js";
import { buildErrorContainer } from "../../utils/errorContainer.js";

export const data = new SlashCommandBuilder().setName("build-theme").setDescription("Build a custom client theme");

export async function execute(interaction: ChatInputCommandInteraction) {
	const now = Date.now();
	const cooldownAmount = 5 * 60 * 1000;

	if (cooldowns.has(interaction.user.id)) {
		const expirationTime = cooldowns.get(interaction.user.id)! + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = ((expirationTime - now) / 1000).toFixed(0);
			return interaction.reply(
				buildErrorContainer("Cooldown Active", `Please wait ${timeLeft} more seconds before reusing \`/build-theme\`.`),
			);
		}
	}
	cooldowns.set(interaction.user.id, now);

	const state = getThemeState(interaction.user.id);
	const attachment = await generatePreviewCanvas(state.colors, state.angle, state.activeColorIndex);
	const components = buildThemeContainerPayload(state, attachment.name ?? "theme-preview.png");

	return interaction.reply({ files: [attachment], components, flags: MessageFlags.IsComponentsV2 });
}
