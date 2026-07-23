import { ContainerBuilder, MessageFlags, TextDisplayBuilder } from "discord.js";

export function buildErrorContainer(title: string, description: string) {
	const container = new ContainerBuilder().addTextDisplayComponents(
		new TextDisplayBuilder().setContent(`### ⚠️ ${title}\n${description}`),
	);
	return { components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 };
}
