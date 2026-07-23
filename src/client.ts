import { Client, GatewayIntentBits } from "discord.js";
import type { ThemeState } from "./types.js";

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

export const cooldowns = new Map<string, number>();
export const userThemeState = new Map<string, ThemeState>();
export const userPresetPage = new Map<string, number>();

export function getThemeState(userId: string): ThemeState {
	if (!userThemeState.has(userId)) {
		userThemeState.set(userId, {
			colors: ["#5865F2", "#EB459E"],
			angle: 135,
			intensity: 100,
			mode: "dark",
			activeColorIndex: 0,
		});
	}
	return userThemeState.get(userId)!;
}

export function sanitizeColors(colors: string[]): string[] {
	const filtered = colors.filter((c) => c && c.trim().length > 0);
	return filtered.length > 0 ? filtered : ["#5865F2"];
}
