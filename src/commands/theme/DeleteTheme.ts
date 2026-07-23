import { ContainerBuilder, MessageFlags, SlashCommandBuilder, TextDisplayBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { deleteUserTheme } from "../../db.js";

export const data = new SlashCommandBuilder()
	.setName("delete-theme")
	.setDescription("Delete one of your saved themes")
	.addStringOption((o) => o.setName("name").setDescription("Name of the theme to delete").setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
	const themeName = interaction.options.getString("name", true);
	const deleted = await deleteUserTheme(interaction.user.id, themeName);

	const container = new ContainerBuilder().addTextDisplayComponents(
		new TextDisplayBuilder().setContent(
			deleted
				? `### Theme Deleted\nSuccessfully deleted your saved theme **${themeName}**.`
				: `### Error\nCould not find a saved theme named **${themeName}** owned by you.`,
		),
	);

	return interaction.reply({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
}
