import { getPalette } from "colorthief";

export async function extractPaletteFromImage(imageUrl: string): Promise<string[]> {
	const response = await fetch(imageUrl);
	const arrayBuffer = await response.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const palette = await getPalette(buffer, { colorCount: 5 });
	if (!palette) throw new Error("colorthief returned no palette for this image");

	const colors = palette.map((c) => c.hex().toUpperCase());

	while (colors.length < 5) colors.push("#5865F2");
	return colors;
}
