import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ContainerBuilder,
	MediaGalleryBuilder,
	MediaGalleryItemBuilder,
	SeparatorBuilder,
	TextDisplayBuilder,
} from "discord.js";
import type { ThemeState } from "../types.js";

export function buildThemeContainerPayload(state: ThemeState, previewAttachmentName: string, topText?: string) {
	const container = new ContainerBuilder();

	if (topText) {
		container
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(topText))
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true));
	}

	container
		.addTextDisplayComponents(new TextDisplayBuilder().setContent("# Customize ur theme"))
		.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
		.addTextDisplayComponents(new TextDisplayBuilder().setContent("**Appearance type:**"))
		.addActionRowComponents(
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId("mode_light")
					.setLabel("Light Mode")
					.setStyle(state.mode === "light" ? ButtonStyle.Success : ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("mode_dark")
					.setLabel("Dark Mode")
					.setStyle(state.mode === "dark" ? ButtonStyle.Success : ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("mode_darker")
					.setLabel("Darker Mode")
					.setStyle(state.mode === "darker" ? ButtonStyle.Success : ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("mode_midnight")
					.setLabel("Midnight Mode")
					.setStyle(state.mode === "midnight" ? ButtonStyle.Success : ButtonStyle.Secondary),
			),
		)
		.addTextDisplayComponents(new TextDisplayBuilder().setContent("**Colours (1-5):**"))
		.addActionRowComponents(
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				[0, 1, 2, 3, 4].map((idx) => {
					const hex = state.colors[idx];
					return new ButtonBuilder()
						.setCustomId(`color_btn_${idx}`)
						.setLabel(hex ? hex : `Add Colour ${idx + 1}`)
						.setStyle(hex ? ButtonStyle.Primary : ButtonStyle.Secondary);
				}),
			),
		)
		.addMediaGalleryComponents(
			new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(`attachment://${previewAttachmentName}`)),
		)
		.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Gradient Angle: ${state.angle}**`))
		.addActionRowComponents(
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder().setCustomId("angle_dec").setLabel("<").setStyle(ButtonStyle.Secondary),
				new ButtonBuilder().setCustomId("angle_modal_btn").setLabel("Enter a Value").setStyle(ButtonStyle.Secondary),
				new ButtonBuilder().setCustomId("angle_inc").setLabel(">").setStyle(ButtonStyle.Secondary),
			),
		)
		.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Intensity: ${state.intensity}**`))
		.addActionRowComponents(
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder().setCustomId("intensity_dec").setLabel("<").setStyle(ButtonStyle.Secondary),
				new ButtonBuilder().setCustomId("intensity_modal_btn").setLabel("Enter a Value").setStyle(ButtonStyle.Secondary),
				new ButtonBuilder().setCustomId("intensity_inc").setLabel(">").setStyle(ButtonStyle.Secondary),
			),
		)
		.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
		.addActionRowComponents(
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder().setCustomId("action_surprise").setLabel("Surprise Me").setStyle(ButtonStyle.Success),
				new ButtonBuilder().setCustomId("action_contrast").setLabel("Contrast Check").setStyle(ButtonStyle.Secondary),
			),
		);

	const outerRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder().setCustomId("action_reset").setLabel("Reset").setStyle(ButtonStyle.Danger),
		new ButtonBuilder().setCustomId("action_save_prompt").setLabel("Save").setStyle(ButtonStyle.Success),
		new ButtonBuilder().setCustomId("action_export_css").setLabel("Export CSS").setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId("action_share").setLabel("Share").setStyle(ButtonStyle.Secondary),
	);

	return [container, outerRow];
}
