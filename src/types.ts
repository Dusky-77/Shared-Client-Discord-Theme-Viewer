export enum Theme {
	dark,
	light,
	darker,
	midnight,
}

export interface CustomUserThemeSettings {
	colors: string[];
	gradient_color_stops: number[];
	gradient_angle: number;
	base_mix: number;
}

export interface ClientThemeSettings {
	background_gradient_preset_id?: number;
	custom_user_theme_settings?: CustomUserThemeSettings;
}

export interface SharedClientTheme {
	colors: string[];
	gradient_angle: number;
	base_mix: number;
	base_theme?: Theme | null;
}

export interface ThemeState {
	colors: string[];
	angle: number;
	intensity: number;
	mode: "light" | "dark" | "darker" | "midnight";
	activeColorIndex: number;
}

export const MODES: ThemeState["mode"][] = ["light", "dark", "darker", "midnight"];
