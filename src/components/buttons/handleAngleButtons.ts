import { ActionRowBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import type { ButtonInteraction } from "discord.js";
import { getThemeState } from "../../client.js";
import { buildThemeContainerPayload } from "../../payloads/buildThemeContainer.js";
import { generatePreviewCanvas } from "../../utils/canvas.js";

export async function handleAngleDec(interaction: ButtonInteraction) {
	const state = getThemeState(interaction.user.id);
	state.angle = (state.angle - 15 + 360) % 360;

	const attachment = await generatePreviewCanvas(state.colors, state.angle, state.activeColorIndex);
	const components = buildThemeContainerPayload(state, attachment.name ?? "theme-preview.png");

	return interaction.update({ files: [attachment], components, flags: MessageFlags.IsComponentsV2 });
}

export async function handleAngleInc(interaction: ButtonInteraction) {
	const state = getThemeState(interaction.user.id);
	state.angle = (state.angle + 15) % 360;

	const attachment = await generatePreviewCanvas(state.colors, state.angle, state.activeColorIndex);
	const components = buildThemeContainerPayload(state, attachment.name ?? "theme-preview.png");

	return interaction.update({ files: [attachment], components, flags: MessageFlags.IsComponentsV2 });
}

export async function handleAngleModalBtn(interaction: ButtonInteraction) {
	const state = getThemeState(interaction.user.id);
	const modal = new ModalBuilder().setCustomId("modal_angle").setTitle("Gradient Angle");
	const input = new TextInputBuilder()
		.setCustomId("angle_value")
		.setLabel("Enter Angle (0-360)")
		.setStyle(TextInputStyle.Short)
		.setValue(state.angle.toString())
		.setRequired(true);

	modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
	return interaction.showModal(modal);
}
