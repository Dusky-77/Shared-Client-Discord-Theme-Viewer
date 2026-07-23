import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import type { ButtonInteraction } from "discord.js";
import { getThemeState } from "../../client.js";

export async function handleColorButton(interaction: ButtonInteraction) {
	const state = getThemeState(interaction.user.id);
	const slotIndex = parseInt(interaction.customId.replace("color_btn_", ""));
	state.activeColorIndex = slotIndex;

	const modal = new ModalBuilder().setCustomId(`modal_color_${slotIndex}`).setTitle(`Set Color ${slotIndex + 1}`);
	const input = new TextInputBuilder()
		.setCustomId("color_value")
		.setLabel('Enter #HEX, "random", or "remove"')
		.setStyle(TextInputStyle.Short)
		.setPlaceholder("#ff0029, random, or remove")
		.setRequired(true);

	modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
	return interaction.showModal(modal);
}
