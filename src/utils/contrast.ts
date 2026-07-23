export function getLuminance(hex: string): number {
	const rgb = hex
		.replace("#", "")
		.match(/.{2}/g)
		?.map((x) => parseInt(x, 16) / 255) || [0, 0, 0];
	const [r, g, b] = rgb.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(hex1: string, hex2: string): number {
	const l1 = getLuminance(hex1);
	const l2 = getLuminance(hex2);
	const max = Math.max(l1, l2);
	const min = Math.min(l1, l2);
	return (max + 0.05) / (min + 0.05);
}

export interface ThemeContrastResult {
	backgroundHex: string;
	modeName: string;
	bgResults: { color: string; ratio: number; passAA: boolean }[];
	adjacentResults: { pair: string; ratio: number }[];
}

export function evaluateFullThemeContrast(colors: string[], mode: string): ThemeContrastResult {
	const bgMap: Record<string, string> = {
		light: "#FFFFFF",
		dark: "#313338",
		darker: "#1E1F22",
		midnight: "#000000",
	};
	const bgHex = bgMap[mode] || "#313338";

	const bgResults = colors.map((c) => {
		const ratio = getContrastRatio(c, bgHex);
		return { color: c, ratio: parseFloat(ratio.toFixed(2)), passAA: ratio >= 4.5 };
	});

	const adjacentResults: { pair: string; ratio: number }[] = [];
	for (let i = 0; i < colors.length - 1; i++) {
		const ratio = getContrastRatio(colors[i], colors[i + 1]);
		adjacentResults.push({ pair: `${colors[i]} / ${colors[i + 1]}`, ratio: parseFloat(ratio.toFixed(2)) });
	}

	return { backgroundHex: bgHex, modeName: mode, bgResults, adjacentResults };
}
