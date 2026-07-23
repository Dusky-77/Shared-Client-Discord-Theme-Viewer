import { ActionRowBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import type { ButtonInteraction } from "discord.js";
import { userPresetPage } from "../../client.js";
import { buildPresetsPayload } from "../../payloads/buildPresetsPayload.js";

export async function handlePresetPageFirst(interaction: ButtonInteraction) {
	userPresetPage.set(interaction.user.id, 1);
	const payload = await buildPresetsPayload(1);
	return interaction.update({ ...payload, flags: MessageFlags.IsComponentsV2 });
}

export async function handlePresetPageModal(interaction: ButtonInteraction) {
	const modal = new ModalBuilder().setCustomId("modal_preset_page").setTitle("Jump to Page");
	const input = new TextInputBuilder()
		.setCustomId("preset_page_value")
		.setLabel("Enter Page Number")
		.setStyle(TextInputStyle.Short)
		.setPlaceholder("Enter a valid page number")
		.setRequired(true);

	modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
	return interaction.showModal(modal);
}

export async function handlePresetPageDynamic(interaction: ButtonInteraction) {
	const pageStr = interaction.customId.replace("preset_page_", "");
	const targetPage = parseInt(pageStr, 10) || 1;
	userPresetPage.set(interaction.user.id, targetPage);
	const { components, files, flags } = await buildPresetsPayload(targetPage);

	return interaction.update({ components, files, flags: flags as any });
}