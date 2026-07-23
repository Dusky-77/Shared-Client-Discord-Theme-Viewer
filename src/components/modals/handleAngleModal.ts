import type { ModalSubmitInteraction } from "discord.js";
import { getThemeState } from "../../client.js";
import { buildThemeContainerPayload } from "../../payloads/buildThemeContainer.js";
import { generatePreviewCanvas } from "../../utils/canvas.js";
import { buildErrorContainer } from "../../utils/errorContainer.js";

export async function handleModalAngle(interaction: ModalSubmitInteraction) {
	const state = getThemeState(interaction.user.id);
	const val = parseInt(interaction.fields.getTextInputValue("angle_value").trim());

	if (isNaN(val) || val < 0 || val > 360) {
		return interaction.reply(buildErrorContainer("Invalid Angle", "Angle must be a number between 0 and 360."));
	}
	state.angle = val;

	const attachment = await generatePreviewCanvas(state.colors, state.angle, state.activeColorIndex);
	const components = buildThemeContainerPayload(state, attachment.name ?? "theme-preview.png");

	await interaction.deferUpdate();
	return interaction.editReply({ files: [attachment], components });
}
