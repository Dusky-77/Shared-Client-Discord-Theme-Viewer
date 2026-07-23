import {
	AttachmentBuilder,
	ContainerBuilder,
	MediaGalleryBuilder,
	MediaGalleryItemBuilder,
	MessageFlags,
	SeparatorBuilder,
	TextDisplayBuilder,
} from "discord.js";
import { getUserThemes } from "../db.js";
import { createMiniSwatch } from "../utils/canvas.js";

export async function buildMyThemesPayload(userId: string) {
	const themes = await getUserThemes(userId);
	const container = new ContainerBuilder()
		.addTextDisplayComponents(new TextDisplayBuilder().setContent("# Your Saved Themes (Max 5)"))
		.addSeparatorComponents(new SeparatorBuilder().setDivider(true));

	const files: AttachmentBuilder[] = [];

	if (themes.length === 0) {
		container.addTextDisplayComponents(
			new TextDisplayBuilder().setContent("You have no saved themes yet. Build and save one with `/build-theme`!"),
		);
	} else {
		for (let i = 0; i < themes.length; i++) {
			const t = themes[i];
			const colors = JSON.parse(t.colors);
			const file = await createMiniSwatch(colors);
			files.push(file);

			container.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					`### ${i + 1}. ${t.name}\n- **Visibility**: ${t.is_public ? "Public" : "Private"}\n- **Mode**: ${t.mode} | **Angle**: ${t.angle}° | **Intensity**: ${t.intensity}%\n- **Colors**: ${colors.join(", ")}`,
				),
			);
			container.addMediaGalleryComponents(
				new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(`attachment://${file.name}`)),
			);
			if (i < themes.length - 1) container.addSeparatorComponents(new SeparatorBuilder().setDivider(true));
		}
	}

	return { components: [container], files, flags: MessageFlags.IsComponentsV2 };
}
