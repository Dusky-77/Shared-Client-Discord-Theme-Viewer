import type { ModalSubmitInteraction } from "discord.js";
import { getThemeState, sanitizeColors } from "../../client.js";
import { buildThemeContainerPayload } from "../../payloads/buildThemeContainer.js";
import { generatePreviewCanvas } from "../../utils/canvas.js";
import { buildErrorContainer } from "../../utils/errorContainer.js";

export async function handleModalColor(interaction: ModalSubmitInteraction) {
	const state = getThemeState(interaction.user.id);
	const slotIndex = parseInt(interaction.customId.replace("modal_color_", ""));
	const val = interaction.fields.getTextInputValue("color_value").trim().toLowerCase();

	if (val === "remove") {
		delete state.colors[slotIndex];
	} else if (val === "random") {
		state.colors[slotIndex] = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0").toUpperCase()}`;
	} else {
		const hex = val.startsWith("#") ? val : `#${val}`;
		if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
			return interaction.reply(
				buildErrorContainer("Invalid Color", "Please enter a valid 6-character hex code (e.g. `#FF0029`), `random`, or `remove`."),
			);
		}
		state.colors[slotIndex] = hex.toUpperCase();
	}

	state.colors = sanitizeColors(state.colors);
	if (state.activeColorIndex >= state.colors.length) {
		state.activeColorIndex = state.colors.length - 1;
	}

	const attachment = await generatePreviewCanvas(state.colors, state.angle, state.activeColorIndex);
	const components = buildThemeContainerPayload(state, attachment.name ?? "theme-preview.png");

	await interaction.deferUpdate();
	return interaction.editReply({ files: [attachment], components });
}
