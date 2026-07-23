import { MessageFlags, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { getThemeState } from "../../client.js";
import { buildThemeContainerPayload } from "../../payloads/buildThemeContainer.js";
import { generatePreviewCanvas } from "../../utils/canvas.js";
import { buildErrorContainer } from "../../utils/errorContainer.js";
import { extractPaletteFromImage } from "../../utils/palette.js";

export const data = new SlashCommandBuilder()
	.setName("theme-from-image")
	.setDescription("Extract a color palette from an image")
	.addAttachmentOption((o) => o.setName("image").setDescription("Image to extract palette from").setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
	const img = interaction.options.getAttachment("image", true);

	let colors: string[];
	try {
		colors = await extractPaletteFromImage(img.url);
	} catch {
		return interaction.reply(
			buildErrorContainer("Extraction Failed", "Could not extract a palette from that image. Try a different file."),
		);
	}

	const state = getThemeState(interaction.user.id);
	state.colors = colors;
	state.activeColorIndex = 0;

	const attachment = await generatePreviewCanvas(state.colors, state.angle, state.activeColorIndex);
	const components = buildThemeContainerPayload(state, attachment.name ?? "theme-preview.png", `Extracted palette: ${colors.join(", ")}`);

	return interaction.reply({ files: [attachment], components, flags: MessageFlags.IsComponentsV2 });
}
