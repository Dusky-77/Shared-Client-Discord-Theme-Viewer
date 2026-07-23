import { MessageFlags } from "discord.js";
import type { ButtonInteraction } from "discord.js";
import { getThemeState } from "../../client.js";
import { buildThemeContainerPayload } from "../../payloads/buildThemeContainer.js";
import { generatePreviewCanvas } from "../../utils/canvas.js";

export async function handleModeButton(interaction: ButtonInteraction) {
	const state = getThemeState(interaction.user.id);
	state.mode = interaction.customId.replace("mode_", "") as typeof state.mode;

	const attachment = await generatePreviewCanvas(state.colors, state.angle, state.activeColorIndex);
	const components = buildThemeContainerPayload(state, attachment.name ?? "theme-preview.png");

	return interaction.update({ files: [attachment], components, flags: MessageFlags.IsComponentsV2 });
}
