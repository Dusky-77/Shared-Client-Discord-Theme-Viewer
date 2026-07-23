import { AttachmentBuilder } from "discord.js";

export function generateCssExport(colors: string[], angle: number, intensity: number, mode: string): AttachmentBuilder {
	const gradientStops = colors
		.map((c, i) => `${c} ${((i / Math.max(colors.length - 1, 1)) * 100).toFixed(0)}%`)
		.join(", ");

	const cssContent = `/* Discord Custom Theme Export */
:root {
  --theme-mode: ${mode};
  --theme-angle: ${angle}deg;
  --theme-intensity: ${intensity}%;
  --theme-gradient: linear-gradient(${angle}deg, ${gradientStops});
  --theme-color-1: ${colors[0] || "transparent"};
  --theme-color-2: ${colors[1] || "transparent"};
  --theme-color-3: ${colors[2] || "transparent"};
  --theme-color-4: ${colors[3] || "transparent"};
  --theme-color-5: ${colors[4] || "transparent"};
}

.visual-refresh {
  background: var(--theme-gradient) !important;
  filter: saturate(${intensity}%);
}
`;

	return new AttachmentBuilder(Buffer.from(cssContent, "utf-8"), { name: "theme.css" });
}
