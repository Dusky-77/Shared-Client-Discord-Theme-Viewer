import {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonStyle,
	ContainerBuilder,
	MediaGalleryBuilder,
	MediaGalleryItemBuilder,
	MessageFlags,
	SeparatorBuilder,
	TextDisplayBuilder,
} from "discord.js";
import { getPublicPresets, getPublicPresetsCount } from "../db.js";
import { createMiniSwatch } from "../utils/canvas.js";

export async function buildPresetsPayload(page: number = 1) {
	const presets = await getPublicPresets(page);
	const container = new ContainerBuilder()
		.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# Community Theme Presets (Page ${page})`))
		.addSeparatorComponents(new SeparatorBuilder().setDivider(true));

	const files: AttachmentBuilder[] = [];

	if (presets.length === 0) {
		container.addTextDisplayComponents(
			new TextDisplayBuilder().setContent("No public theme presets found for this page."),
		);
	} else {
		const limitedPresets = presets.slice(0, 3);
		for (let i = 0; i < limitedPresets.length; i++) {
			const p = limitedPresets[i];
			const colors = JSON.parse(p.colors);
			const file = await createMiniSwatch(colors);
			files.push(file);

			container.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					`### ${p.name}\n- **By**: <@${p.user_id}> | **Mode**: ${p.mode} | **Angle**: ${p.angle}°\n- **Colors**: ${colors.join(", ")}`,
				),
			);
			container.addMediaGalleryComponents(
				new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(`attachment://${file.name}`)),
			);
			if (i < limitedPresets.length - 1) {
				container.addSeparatorComponents(new SeparatorBuilder().setDivider(true));
			}
		}
	}

	const totalCount = await getPublicPresetsCount();
	const limit = 7;
	const totalPages = Math.ceil(totalCount / limit) || 1;
	const isEnterValueDisabled = totalPages < 2;

	const paginationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("preset_page_first")
			.setLabel("<<")
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(page <= 1),
		new ButtonBuilder()
			.setCustomId(`preset_page_${Math.max(1, page - 1)}`)
			.setLabel("<")
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(page <= 1),
		new ButtonBuilder()
			.setCustomId("preset_page_modal")
			.setLabel("Enter a Value")
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(isEnterValueDisabled),
		new ButtonBuilder()
			.setCustomId(`preset_page_${page + 1}`)
			.setLabel(">")
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(page >= totalPages || presets.length < 3),
		new ButtonBuilder()
			.setCustomId(`preset_page_last_${totalPages}`)
			.setLabel(">>")
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(page >= totalPages),
	);

	return { components: [container, paginationRow], files, flags: MessageFlags.IsComponentsV2 };
}