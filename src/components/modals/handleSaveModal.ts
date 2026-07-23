import { ContainerBuilder, MessageFlags, TextDisplayBuilder } from "discord.js";
import type { ModalSubmitInteraction } from "discord.js";
import { getThemeState } from "../../client.js";
import { saveUserTheme } from "../../db.js";
import { buildErrorContainer } from "../../utils/errorContainer.js";

export async function handleModalSaveTheme(interaction: ModalSubmitInteraction) {
	const state = getThemeState(interaction.user.id);
	const name = interaction.fields.getTextInputValue("save_name").trim();
	const visStr = interaction.fields.getTextInputValue("save_vis").trim().toLowerCase();
	const isPublic = visStr === "public";

	const saved = await saveUserTheme(interaction.user.id, name, state.colors, state.angle, state.intensity, state.mode, isPublic);
	if (!saved) {
		return interaction.reply(buildErrorContainer("Limit Reached", "You have reached the limit of 5 saved themes. Delete one first!"));
	}

	const container = new ContainerBuilder().addTextDisplayComponents(
		new TextDisplayBuilder().setContent(`### Theme Saved!\nSuccessfully saved **${name}** as **${isPublic ? "Public" : "Private"}**.`),
	);

	return interaction.reply({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
}
