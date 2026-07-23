import type { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import * as BuildTheme from "./theme/BuildTheme.js";
import * as DeleteTheme from "./theme/DeleteTheme.js";
import * as MyThemes from "./theme/MyThemes.js";
import * as Presets from "./theme/Presets.js";
import * as ThemeFromImage from "./theme/ThemeFromImage.js";

interface Command {
	data: SlashCommandBuilder;
	execute: (interaction: ChatInputCommandInteraction) => Promise<unknown>;
}

export const commands: Command[] = [BuildTheme, MyThemes, Presets, DeleteTheme, ThemeFromImage] as Command[];
