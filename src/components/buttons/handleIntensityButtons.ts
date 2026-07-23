import { ActionRowBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import type { ButtonInteraction } from "discord.js";
import { getThemeState } from "../../client.js";
import { buildThemeContainerPayload } from "../../payloads/buildThemeContainer.js";
import { generatePreviewCanvas } from "../../utils/canvas.js";

export async function handleIntensityDec(interaction: ButtonInteraction) {
	const state = getThemeState(interaction.user.id);
	state.intensity = Math.max(0, state.intensity - 10);

	const attachment = await generatePreviewCanvas(state.colors, state.angle, state.activeColorIndex);
	const components = buildThemeContainerPayload(state, attachment.name ?? "theme-preview.png");

	return interaction.update({ files: [attachment], components, flags: MessageFlags.IsComponentsV2 });
}

export async function handleIntensityInc(interaction: ButtonInteraction) {
	const state = getThemeState(interaction.user.id);
	state.intensity = Math.min(100, state.intensity + 10);

	const attachment = await generatePreviewCanvas(state.colors, state.angle, state.activeColorIndex);
	const components = buildThemeContainerPayload(state, attachment.name ?? "theme-preview.png");

	return interaction.update({ files: [attachment], components, flags: MessageFlags.IsComponentsV2 });
}

export async function handleIntensityModalBtn(interaction: ButtonInteraction) {
	const state = getThemeState(interaction.user.id);
	const modal = new ModalBuilder().setCustomId("modal_intensity").setTitle("Gradient Intensity");
	const input = new TextInputBuilder()
		.setCustomId("intensity_value")
		.setLabel("Enter Intensity (0-100)")
		.setStyle(TextInputStyle.Short)
		.setValue(state.intensity.toString())
		.setRequired(true);

	modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
	return interaction.showModal(modal);
}
