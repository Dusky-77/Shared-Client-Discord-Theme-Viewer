import type { ModalSubmitInteraction } from "discord.js";
import { userPresetPage } from "../../client.js";
import { buildPresetsPayload } from "../../payloads/buildPresetsPayload.js";
import { buildErrorContainer } from "../../utils/errorContainer.js";

export async function handleModalPresetPage(interaction: ModalSubmitInteraction) {
	const val = parseInt(interaction.fields.getTextInputValue("preset_page_value").trim());
	if (isNaN(val) || val < 1) {
		return interaction.reply(buildErrorContainer("Invalid Page", "Please enter a valid positive page number."));
	}

	userPresetPage.set(interaction.user.id, val);
	await interaction.deferUpdate();
	const { components, files, flags } = await buildPresetsPayload(val);

	return interaction.editReply({ components, files, flags: flags as any });
}
